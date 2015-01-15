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
var map = L.map('map').setView([35.505, -70.09], 3);
L.tileLayer('http://{s}.tiles.mapbox.com/v3/examples.map-i87786ca/{z}/{x}/{y}.png', {
    attribution: 'Riotlink Views',
    maxZoom: 18
}).addTo(map);

var markerGroup = L.layerGroup();
socket.on('newData', function(data){
    $('#currentViewHolder').html(data.currentViews);
    $('#totalViewsHolder').html(data.totalViews);
    var twitterViews = 0;
    markerGroup.clearLayers();
    data.views.map(function(view){

        if(typeof(view.geo) != 'null') L.marker(view.geo.ll).addTo(markerGroup);
        if(view.referer_c === "Twitter") twitterViews++;
        if(view.referer_c === "Facebook") facebookViews++;
        if(view.referer_c === "Google") googlePlusViews++;
    });
    markerGroup.addTo(map);

    $('#twitterViews').html(twitterViews);
});
