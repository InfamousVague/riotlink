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
        $('#debugMessage').hide();
        setTimeout(function(){
            $('#debugMessage').fadeIn();
        }, 1000);
        if(typeof tt != 'undefined'){

        }else{
            $('#viewToolbar').hide();
            $('#site').css({
                'height':'100%'
            });
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
                <div id="debugMessage">
                    <h4>Blank Page?</h4>
                    <p>Your supplied link may not support advanced tracking, disable this by toggling off advanced tracking on our home page.<br /><br />
                    <img src="http://i.gyazo.com/e0a805d870e5fd4456676cfca37bf32e.png"/></p>
                </div>
                <iframe border="0" height="100%" width="100%" src="null" id="site">
                </iframe>
            </div>
        );
    }
});

React.renderComponent(
    <Page />,
    document.getElementById('render')
);
/*jshint ignore:end*/
