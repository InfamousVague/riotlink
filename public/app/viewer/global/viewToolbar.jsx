/** @jsx React.DOM */

var React = require('react');

/*jshint ignore:start*/
var ViewToolbar = React.createClass({
    render: function(){
        return(
            <div id="viewToolbar">
                <div className="container-fluid">
                    <div className="title">
                        <a href="/">
                            <img src="app/img/logo.png" className="logo" />
                        </a>
                    </div>
                    <div className="row innerBody">
                        <div className="col-xs-12">
                            <p className="descript">Your share link is:</p>
                            <div className="container">
                                <input id="shortLink" value={'http://rls.li/r/' + this.props.rid}></input>
                                <a className="button" data-clipboard-text={'http://rls.li/r/' + this.props.rid} href="#" id="shortLinkLink">Share</a>
                            </div>
                        </div>
                        <div className="col-xs-12">
                            <p className="descript">Track it with:</p>
                            <div className="container">
                                <input id="trackingLink" value={'http://riotlink.net/t/' + this.props.tid}></input>
                                <a className="button" href={'http://riotlink.net/t/' + this.props.tid} target="_blank" id="trackingLinkLink">Track</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
/*jshint ignore:end*/

module.exports = ViewToolbar;
