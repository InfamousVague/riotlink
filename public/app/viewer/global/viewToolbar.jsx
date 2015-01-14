/** @jsx React.DOM */

var React = require('react');

/*jshint ignore:start*/
var ViewToolbar = React.createClass({
    render: function(){
        return(
            <div id="viewToolbar">
                <a href="/">
                    <img src="app/img/logo.png" className="logo" />
                </a>
                <div className="inputWrapper">
                    <label>Short Link: </label>
                    <input id="shortLink"></input>
                    <a className="button" href="#" target="_blank" id="shortLinkLink">Open</a>
                    <label style={{'padding-left':'4em'}}>Tracking Link: </label>
                    <input id="trackingLink"></input>
                    <a className="button" href="#" target="_blank" id="trackingLinkLink">Open</a>

                    <label id="trackingType" style={{'padding-left':'4em'}}>trackingType</label>
                </div>
            </div>
        );
    }
});
/*jshint ignore:end*/

module.exports = ViewToolbar;
