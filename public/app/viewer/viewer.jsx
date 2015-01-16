/** @jsx React.DOM */

var React       = require('react');
var ViewToolbar = require('./global/viewToolbar.jsx'),
    socket      = io();

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

socket.emit('connected', {
    rid : rid
});
/*jshint ignore:start*/
var Page = React.createClass({
    getInitialState: function(){
        return{
            rid: rid,
            tid: tid
        };
    },
    componentDidMount: function(){
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

        window.history.replaceState('Object', 'Title', 'r/' + getUrlVars()['rid']);


        var client = new ZeroClipboard( document.getElementById("shortLinkLink") );
        client.on( "ready", function( readyEvent ) {
            client.on( "aftercopy", function( event ) {
                // `this` === `client`
                // `event.target` === the element that was clicked
                $('#shortLinkLink').html('Copied!');
            } );
        } );
    },
    render: function(){
        return(
            <div className="reactBody">
                <ViewToolbar rid={this.state.rid} tid={this.state.tid}/>
                <iframe border="0" height="100%" width="100%" src="null" id="site"></iframe>
            </div>
        );
    }
});

React.renderComponent(
    <Page />,
    document.getElementById('render')
);
/*jshint ignore:end*/
