/** @jsx React.DOM */

var React = require('react');

/*jshint ignore:start*/
var AdvancedPanelOff = React.createClass({
    render: function(){
        return(
            <div id="AdvancedPanelOff" className="trackingPanel">
                <h3>Advanced tracking is off!</h3>
                <p>To enable advanced tracking select settings from the left menu
                    and check the Advanced Tracking toggle on.</p>
            </div>
        );
    }
});
/*jshint ignore:end*/

module.exports = AdvancedPanelOff;
