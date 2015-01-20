/** @jsx React.DOM */

var React           = require('react'),
    Sidebar         = require('./components/sidebar.jsx'),
    Numbers         = require('./components/numbers.jsx'),
    Map             = require('./components/map.jsx'),
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
            currentViews : 0,
            totalViews   : 0,
            socialViews  : {
                twitterViews    : 0,
                facebookViews   : 0,
                googlePlusViews : 0
            }
        };
    },
    componentDidMount: function(){
        $('#mapHolder').hide();
        $('#statsButton').click(function(){
            $('#sidebar ul li').removeClass('active');
            $(this).addClass('active');
            $('#mapHolder').hide();
            $('#stats').show();
        });
        $('#geoButton').click(function(){
            $('#sidebar ul li').removeClass('active');
            $(this).addClass('active');
            $('#mapHolder').show();
            $('#stats').hide();

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


        /*==================
        =    Views/Map     =
        ==================*/
        var markerGroup = L.layerGroup();
        socket.on('newData', function(data){
            var twitterViews = 0,
                facebookViews = 0,
                googlePlusViews = 0,
                viewsTimestamps = [];

            markerGroup.clearLayers();
            data.views.map(function(view){
                viewsTimestamps.push(view.timestamp);
                if(typeof(view.geo) != 'null') L.marker(view.geo.ll).addTo(markerGroup);
                if(view.referer_c === "Twitter") twitterViews++;
                if(view.referer_c === "Facebook") facebookViews++;
                if(view.referer_c === "Google") googlePlusViews++;
            });
            markerGroup.addTo(map);

            that.setState({
                currentViews    : data.currentViews,
                totalViews      : data.totalViews,
                socialViews     : {
                    twitter     : twitterViews,
                    facebook    : facebookViews,
                    google      : googlePlusViews
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
                        <h1>Statistics</h1>
                        <Numbers totalViews={this.state.totalViews} socialViews={this.state.socialViews} />
                    </div>
                    <div id="mapHolder" className="col-md-10">
                        <h1>Views by location</h1>
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
