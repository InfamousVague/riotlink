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

socket.on('newData', function(data){
    console.log(data);
    $('#currentViewHolder').html(data.currentViews);
    $('#totalViewsHolder').html(data.totalViews);
    var twitterViews = 0;
    data.views.map(function(view){
        if(view.referer_c === "Twitter") twitterViews++;
        if(view.referer_c === "Facebook") facebookViews++;
        if(view.referer_c === "Google") googlePlusViews++;
    });
    $('#twitterViews').html(twitterViews);
});
