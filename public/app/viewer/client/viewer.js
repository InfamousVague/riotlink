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

$('#shortLink').val('http://rls.li/r/' + rid);
$('#shortLinkLink').attr('data-clipboard-text', 'http://rls.li/r/' + rid);
$('#trackingLink').val('http://rls.li/t/' + getUrlVars()['tid']);
$('#trackingLinkLink').attr('href', 'http://rls.li/t/' + getUrlVars()['tid']);

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

//window.history.replaceState('Object', 'Title', 'r/' + getUrlVars()['rid']);


var client = new ZeroClipboard( document.getElementById("shortLinkLink") );
client.on( "ready", function( readyEvent ) {
    client.on( "aftercopy", function( event ) {
        // `this` === `client`
        // `event.target` === the element that was clicked
        $('#shortLinkLink').html('Copied!');
    } );
} );

/*==================
=     SocketIO     =
==================*/

var socket = io();
socket.emit('connected', {
    rid : rid
});
console.log(rid);
