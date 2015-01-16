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
