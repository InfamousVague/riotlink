/** @jsx React.DOM */

var React           = require('react'),
    CurrentViews    = require('./global/currentViews.jsx'),
    AllViews        = require('./global/allViews.jsx'),
    SocialFollowing = require('./global/socialFollowing.jsx'),
    Map             = require('./global/map.jsx'),
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
    componentDidMount: function(){
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
            googlePlusViews = 0;

            markerGroup.clearLayers();
            data.views.map(function(view){
                if(typeof(view.geo) != 'null') L.marker(view.geo.ll).addTo(markerGroup);
                if(view.referer_c === "Twitter") twitterViews++;
                if(view.referer_c === "Facebook") facebookViews++;
                if(view.referer_c === "Google") googlePlusViews++;
            });
            markerGroup.addTo(map);

            $('#currentViewHolder').html(data.currentViews);
            $('#totalViewsHolder').html(data.totalViews);
            $('#twitterViews').html(twitterViews);
            $('#facebookViews').html(facebookViews);
            $('#googlePlusViews').html(googlePlusViews);
        });
    },
    render: function(){
        return(
            <div className="reactBody tracker">
                <div className="row">
                    <div className="col-xs-12 col-sm-6" style={{'padding-right':'0'}}>
                        <CurrentViews />
                    </div>
                    <div className="col-xs-12 col-sm-6" style={{'padding-left':'0'}}>
                        <AllViews />
                        <SocialFollowing />
                    </div>
                    <div className="col-xs-12">
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
