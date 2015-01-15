/** @jsx React.DOM */

var React = require('react');

/*jshint ignore:start*/
var CurrentViews = React.createClass({
    render: function(){
        return(
            <div id="currentViews">
                <div className="bubbleNumber">
                    <span id="currentViewHolder">0</span>
                </div>
            </div>
        );
    }
});
/*jshint ignore:end*/

module.exports = CurrentViews;
