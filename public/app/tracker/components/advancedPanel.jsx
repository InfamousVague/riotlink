/** @jsx React.DOM */

var React = require('react');

/*jshint ignore:start*/
var AdvancedPanel = React.createClass({
    render: function(){
        return(
            <div id="AdvancedPanel" className="trackingPanel">
                Live Views: {this.props.currentViews}
            </div>
        );
    }
});
/*jshint ignore:end*/

module.exports = AdvancedPanel;
