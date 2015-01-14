function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

var rid     = getUrlVars()['rid'],
    tid     = getUrlVars()['tid'],
    link    = getUrlVars()['link'],
    tt      = getUrlVars()['tt'];

$('#shortLink').val('http://riotlink.net/r?r=' + rid + '&link=' + link);
$('#shortLinkLink').attr('href', 'http://riotlink.net/r?r=' + rid + '&link=' + link);
$('#trackingLink').val('http://riotlink.net/t?t=' + getUrlVars()['tid']);
$('#trackingLinkLink').attr('href', 'http://riotlink.net/t?t=' + getUrlVars()['tid']);

if(typeof tt != 'undefined'){

}else{
    $('#viewToolbar').hide();
    $('#site').css({
        'height':'100%'
    });
}

if (getUrlVars()['tt'] === "a"){
    $('#trackingType').html("Advanced Tracking");
}else{
    $('#trackingType').html("Basic Tracking");
}

$('#site').attr('src', getUrlVars()['link']);

//window.history.replaceState('Object', 'Title', 'r?r=' + getUrlVars()['rid']);

/*==================
=     SocketIO     =
==================*/

var socket = io();
socket.emit('connected', {
    rid : rid
});
