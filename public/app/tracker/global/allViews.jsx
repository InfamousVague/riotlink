/** @jsx React.DOM */

var React = require('react');

/*jshint ignore:start*/
var AllViews = React.createClass({
    render: function(){
        return(
            <div id="allViews">
                <div className="titleBar">
                    <h3>Total Views</h3>
                </div>
                <span id="totalViewsHolder">0</span>
            </div>
        );
    }
});
/*jshint ignore:end*/

module.exports = AllViews;
