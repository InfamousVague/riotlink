/** @jsx React.DOM */

var React = require('react');

/*jshint ignore:start*/
var CurrentViews = React.createClass({
    render: function(){
        return(
            <div id="currentViews">
                <div className="bubbleNumber">
                    <span id="currentViewHolder">{this.props.currentViews}</span>
                </div>
                <br />
                <h4>Live Viewers</h4>
            </div>
        );
    }
});
/*jshint ignore:end*/

module.exports = CurrentViews;
