/** @jsx React.DOM */

var React = require('react');

/*jshint ignore:start*/
var CurrentViews = React.createClass({
    render: function(){
        return(
            <div id="currentViews">
                <div className="titleBar">
                    <h3>Live Viewers</h3>
                </div>
                <div className="bubbleNumber">
                    <span id="currentViewHolder">0</span>
                </div>
            </div>
        );
    }
});
/*jshint ignore:end*/

module.exports = CurrentViews;
