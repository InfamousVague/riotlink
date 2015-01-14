function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

var rid = getUrlVars()['rid'];

/*==================
=     SocketIO     =
==================*/

var socket = io();
socket.emit('setVals', {
    rid : rid
});

socket.on('newData', function(data){

});
