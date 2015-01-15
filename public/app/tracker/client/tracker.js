function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

var tid = getUrlVars()['tid'];
/*==================
=     SocketIO     =
==================*/

var socket = io();
socket.emit('setVals', {
    tid : tid
});

var pollData = setInterval(function(){
    socket.emit('requestData', tid);
}, 1000);


window.history.replaceState('Object', 'Title', 't/' + tid);
$(document).ready(function(){
    L.mapbox.accessToken = 'pk.eyJ1IjoibWR3aXNuaWV3c2tpIiwiYSI6IlV4ZUFPY0UifQ.tQYEPlkZHAEeaESGBl5Ahw';
    // Replace 'examples.map-i87786ca' with your map id.
    var mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/examples.map-i87786ca/{z}/{x}/{y}.png', {
        attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
    });

    var map = L.map('map')
    .addLayer(mapboxTiles)
    .setView([35.3610, -92.0587], 3);
});
socket.on('newData', function(data){
    $('#currentViewHolder').html(data.currentViews);
    $('#totalViewsHolder').html(data.totalViews);
    var twitterViews = 0;
    data.views.map(function(view){
        if(typeof(view.geo.ll) != "undefined"){
            L.marker(view.geo.ll).addTo(map);
        }
        if(view.referer_c === "Twitter") twitterViews++;
        if(view.referer_c === "Facebook") facebookViews++;
        if(view.referer_c === "Google") googlePlusViews++;
    });
    $('#twitterViews').html(twitterViews);
});
