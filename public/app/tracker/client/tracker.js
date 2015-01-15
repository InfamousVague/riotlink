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
    var map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/mdwisniewski.kp2f221o/{z}/{x}/{y}.png', {
        attribution: 'Riotlink Viewers',
        maxZoom: 18
    }).addTo(map);
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
