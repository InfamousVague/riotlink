/** @jsx React.DOM */

var React = require('react');

/*jshint ignore:start*/
var mapView = React.createClass({
    render: function(){
        return(
            <div id="mapView">
                <div id="map"></div>
            </div>
        );
    }
});
/*jshint ignore:end*/

module.exports = mapView;
