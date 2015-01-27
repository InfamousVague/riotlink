/** @jsx React.DOM */

var React           = require('react'),
    Sidebar         = require('./components/sidebar.jsx'),
    Numbers         = require('./components/numbers.jsx'),
    Map             = require('./components/map.jsx'),
    ViewsChart      = require('./components/viewsChart.jsx'),
    AllLinks        = require('./components/allLinks.jsx'),
    AdBlock         = require('./global/adblock.jsx'),
    AdBlock2        = require('./global/adblock2.jsx'),
    socket          = io();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
var tid = getUrlVars()['tid'];
var uid = getUrlVars()['uid'];

/*jshint ignore:start*/
var Page = React.createClass({
    getInitialState: function(){
        return{
            currentViews    : 0,
            links           : [],
            viewsData       : {},
            totalViews      : 0,
            socialViews     : {
                twitter     : {
                    numbers : 0,
                    percent : 0
                },
                facebook    : {
                    numbers : 0,
                    percent : 0
                },
                google      : {
                    numbers : 0,
                    percent : 0
                }
            }
        };
    },
    componentDidMount: function(){
        $('#mapHolder').hide();
        $('#settings').hide();
        $('#allLinksHolder').hide();
        $('#statsButton').click(function(){
            $('#sidebar ul li').removeClass('active');
            $(this).addClass('active');
            $('#mapHolder').hide();
            $('#stats').show();
            $('#allLinksHolder').hide();
            $('#settings').hide();
        });
        $('#geoButton').click(function(){
            $('#sidebar ul li').removeClass('active');
            $(this).addClass('active');
            $('#mapHolder').show();
            map.invalidateSize(false);
            $('#stats').hide();
            $('#allLinksHolder').hide();
            $('#settings').hide();

        });
        $('#linksButton').click(function(){
            $('#sidebar ul li').removeClass('active');
            $(this).addClass('active');
            $('#allLinksHolder').show();
            $('#stats').hide();
            $('#settings').hide();
            $('#mapHolder').hide();
        });
        $('#settingsButton').click(function(){
            $('#sidebar ul li').removeClass('active');
            $(this).addClass('active');
            $('#settings').show();
            $('#stats').hide();
            $('#mapHolder').hide();
            $('#allLinksHolder').hide();

        });
        var that = this;
        /*==================
        =     SocketIO     =
        ==================*/
        socket.emit('setVals', {
            tid : tid
        });

        var pollData = setInterval(function(){
            socket.emit('requestData', tid);

            if(uid)
                socket.emit('requestUserData', uid);

        }, 1000);

        window.history.replaceState('Object', 'Title', 't/' + tid);


        /*==================
        =     Map          =
        ==================*/
        var map = L.map('map').setView([38, -103], 4);
        L.tileLayer('http://{s}.tiles.mapbox.com/v3/examples.map-i87786ca/{z}/{x}/{y}.png', {
            attribution: 'Riotlink Views',
            maxZoom: 18
        }).addTo(map);

        function timeConverter(UNIX_timestamp){
            var a = new Date(UNIX_timestamp);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var time = date + '-' + month + '-' + year;
            return time;
        }

        /*==================
        =    User Page     =
        ==================*/
        socket.on('newUserData', function(data){
            that.setState({links: data.links});
        });


        /*==================
        =    Views/Map     =
        ==================*/
        var markerGroup = L.layerGroup();

        socket.on('newData', function(data){
            var twitterViews = 0,
                facebookViews = 0,
                googlePlusViews = 0,
                viewsTimestamps = [],
                tempViewsData   = {},
                tempViewsArray  = [];

            markerGroup.clearLayers();
            data.views.map(function(view){
                if ( typeof( tempViewsData[ timeConverter( view.timestamp ) ] ) === 'undefined' )
                    tempViewsData[ timeConverter( view.timestamp ) ] = 0;

                tempViewsData[ timeConverter( view.timestamp ) ]++;

                if(!!view.geo)
                    L.marker(view.geo.ll).addTo(markerGroup);

                if(view.referer_c === "Twitter") twitterViews++;
                if(view.referer_c === "Facebook") facebookViews++;
                if(view.referer_c === "Google") googlePlusViews++;
            });
            markerGroup.addTo(map);

            for (var key in tempViewsData) {
                tempViewsArray.push({date: key.toString().slice(0, -4) + key.toString().slice(-2), close: tempViewsData[key]});
            }

            that.setState({
                currentViews    : data.currentViews,
                totalViews      : data.totalViews,
                viewsData       : tempViewsArray,
                socialViews     : {
                    twitter     : {
                        numbers : twitterViews,
                        percent : (twitterViews === 0) ? 0 : Math.floor((twitterViews / data.totalViews) * 100),
                    },
                    facebook    : {
                        numbers : facebookViews,
                        percent : (facebookViews === 0) ? 0 : Math.floor((facebookViews / data.totalViews) * 100),
                    },
                    google      : {
                        numbers : googlePlusViews,
                        percent : (googlePlusViews === 0) ? 0 : Math.floor((googlePlusViews / data.totalViews) * 100),
                    }
                }
            });
        });
    },
    render: function(){
        var allLinks;
        if(uid && uid != 'undefined'){
            allLinks = <AllLinks links={this.state.links} />;
        }else{
            allLinks = <p>Please login to view link history</p>;
        }
        return(
            <div className="reactBody tracker">
                <div className="container-fluid fullHeight">
                    <div className="col-md-2 fullHeight noLeft">
                        <Sidebar />
                    </div>
                    <div id="stats" className="col-md-10">
                        <div className="row">
                            <div className="col-xs-12 col-sm-2">
                                <h1 className="pageTitle">Statistics</h1>
                            </div>
                            <div className="col-xs-12 col-sm-10">

                            </div>
                        </div>

                        <ol className="breadcrumb">
                            <li>Tracker</li>
                            <li className="active">Statistics</li>
                        </ol>
                        <Numbers totalViews={this.state.totalViews} socialViews={this.state.socialViews} />
                            <div className="col-xs-12 col-sm-8 graph">
                                <h2>Views by date</h2>
                                <ViewsChart viewsData={this.state.viewsData} />
                            </div>

                    </div>
                    <div id="mapHolder" className="col-md-10">
                        <div className="row">
                            <div className="col-xs-12 col-sm-2">
                                <h1 className="pageTitle">Geolocation</h1>
                            </div>
                            <div className="col-xs-12 col-sm-10">

                            </div>
                        </div>
                            <ol className="breadcrumb">
                            <li>Tracker</li>
                            <li className="active">Location Map</li>
                        </ol>
                        <Map />
                    </div>
                    <div id="allLinksHolder" className="col-md-10">
                        <div className="row">
                            <div className="col-xs-12 col-sm-2">
                                <h1 className="pageTitle">Link&nbsp;History</h1>
                            </div>
                            <div className="col-xs-12 col-sm-10">

                            </div>
                        </div>
                            <ol className="breadcrumb">
                            <li>Tracker</li>
                            <li className="active">All Links</li>
                        </ol>

                        {allLinks}

                    </div>
                    <div id="settings" className="col-md-10">
                        <div className="row">
                            <div className="col-xs-12 col-sm-2">
                                <h1 className="pageTitle">Settings</h1>
                            </div>
                            <div className="col-xs-12 col-sm-10">

                            </div>
                        </div>
                            <ol className="breadcrumb">
                            <li>Tracker</li>
                            <li className="active">Settings</li>
                            </ol>
                    </div>
                </div>
            </div>
        );
    }
});

React.renderComponent(
    <Page />,
    document.getElementById('render')
);
/*jshint ignore:end*/
