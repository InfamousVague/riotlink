/** @jsx React.DOM */

var React = require('react');

/*jshint ignore:start*/
var Sidebar = React.createClass({
    render: function(){
        return(
            <div id="sidebar">
                <a href="/">
                    <img id="logo" src="app/img/logo.png" />
                </a>
                <ul>
                    <li className="active" id="statsButton">
                        <div className="row">
                            <div className="col-xs-3">
                            <i className="fa fa-area-chart"></i>
                            </div>
                            <div className="col-xs-9">
                                Statistics
                            </div>
                        </div>
                    </li>
                    <li id="geoButton">
                        <div className="row">
                            <div className="col-xs-3">
                                <i className="fa fa-map-marker"></i>
                            </div>
                            <div className="col-xs-9">
                                Geolocation
                            </div>
                        </div>
                    </li>
                    <li id="settingsButton">
                        <div className="row">
                            <div className="col-xs-3">
                                <i className="fa fa-cog"></i>
                            </div>
                            <div className="col-xs-9">
                                Settings
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
});
/*jshint ignore:end*/

module.exports = Sidebar;
