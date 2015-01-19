/** @jsx React.DOM */

var React = require('react');

/*jshint ignore:start*/
var AdBlock = React.createClass({
    componentDidMount: function(){
        ( function() {
            if (window.CHITIKA === undefined) { window.CHITIKA = { 'units' : [] }; };
            var unit = {"calltype":"async[2]","publisher":"mdwisniewski","width":300,"height":150,"sid":"Chitika Default"};
            var placement_id = window.CHITIKA.units.length;
            window.CHITIKA.units.push(unit);
            $('#AdBlock').html('<div id="chitikaAdBlock-' + placement_id + '"></div>');
        }());
    },
    render: function(){
        return(
            <div id="AdBlock">
                Ad Goes Here
            </div>
        );
    }
});
/*jshint ignore:end*/

module.exports = AdBlock;
