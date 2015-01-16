/** @jsx React.DOM */

var React = require('react');

/*jshint ignore:start*/
var ViewsChart = React.createClass({
    render: function(){
        return(
            <canvas id="viewsChart" width="500" height="500"></canvas>
        );
    }
});
/*jshint ignore:end*/

module.exports = ViewsChart;
