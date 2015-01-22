/** @jsx React.DOM */

var React           = require('react'),
    Sidebar         = require('./components/sidebar.jsx'),
    Numbers         = require('./components/numbers.jsx'),
    Map             = require('./components/map.jsx'),
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

/*jshint ignore:start*/
var Page = React.createClass({
    getInitialState: function(){
        return{
            currentViews    : 0,
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
        $('#statsButton').click(function(){
            $('#sidebar ul li').removeClass('active');
            $(this).addClass('active');
            $('#mapHolder').hide();
            $('#stats').show();
            $('#settings').hide();
        });
        $('#geoButton').click(function(){
            $('#sidebar ul li').removeClass('active');
            $(this).addClass('active');
            $('#mapHolder').show();
            map.invalidateSize(false);
            $('#stats').hide();
            $('#settings').hide();

        });
        $('#settingsButton').click(function(){
            $('#sidebar ul li').removeClass('active');
            $(this).addClass('active');
            $('#settings').show();
            $('#stats').hide();
            $('#mapHolder').hide();

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
            var a = new Date(UNIX_timestamp*1000);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var time = date + '-' + month + '-' + year;
            return time;
        }
        /*==================
        =    Views/Map     =
        ==================*/
        var markerGroup = L.layerGroup();
        socket.on('newData', function(data){
            var twitterViews = 0,
                facebookViews = 0,
                googlePlusViews = 0,
                viewsTimestamps = [],
                viewsPerDate = {};

            markerGroup.clearLayers();
            data.views.map(function(view){
                if ( typeof( viewsPerDate[ timeConverter( view.timestamp ) ] ) === 'undefined' )
                    viewsPerDate[ timeConverter( view.timestamp ) ] = 0;

                viewsPerDate[ timeConverter( view.timestamp ) ]++;

                function getLast30Days(){

                }

                if(view.geo != 'null')
                    L.marker(view.geo.ll).addTo(markerGroup);

                if(view.referer_c === "Twitter") twitterViews++;
                if(view.referer_c === "Facebook") facebookViews++;
                if(view.referer_c === "Google") googlePlusViews++;
            });
            markerGroup.addTo(map);

            that.setState({
                currentViews    : data.currentViews,
                totalViews      : data.totalViews,
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
                        <Map />
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
