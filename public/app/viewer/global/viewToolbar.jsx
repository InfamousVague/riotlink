/** @jsx React.DOM */

var React = require('react');

/*jshint ignore:start*/
var ViewToolbar = React.createClass({
    render: function(){
        return(
            <div id="viewToolbar">
                <div className="row">
                    <div className="col-xs-12 col-sm-2">
                        <a href="/">
                            <img src="app/img/logo.png" className="logo" />
                        </a>
                    </div>
                    <div className="col-xs-12 col-sm-5">
                        <input id="shortLink"></input>
                        <a className="button" data-clipboard-text="Copy Me!" href="#" id="shortLinkLink">Copy</a>
                    </div>
                    <div className="col-xs-12 col-sm-5">
                        <input id="trackingLink"></input>
                        <a className="button" href="#" target="_blank" id="trackingLinkLink">Track</a>
                    </div>
                </div>
            </div>
        );
    }
});
/*jshint ignore:end*/

module.exports = ViewToolbar;
