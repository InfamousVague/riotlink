/** @jsx React.DOM */

var React = require('react');

/*jshint ignore:start*/
var AdBlock = React.createClass({
    componentDidMount: function(){
        ( function() {
            if (window.CHITIKA === undefined) { window.CHITIKA = { 'units' : [] }; };
            var unit = {"calltype":"async[2]","publisher":"mdwisniewski","width":728,"height":90,"sid":"Chitika Default2"};
            var placement_id = window.CHITIKA.units.length;
            window.CHITIKA.units.push(unit);
            $('#AdBlock2').html('<div id="chitikaAdBlock-' + placement_id + '"></div>');
        }());
    },
    render: function(){
        return(
            <div id="AdBlock2">
                Ad Goes Here
            </div>
        );
    }
});
/*jshint ignore:end*/

module.exports = AdBlock;
