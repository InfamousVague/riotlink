/** @jsx React.DOM */

var React = require('react'),
    socket = io();

/*jshint ignore:start*/
var Settings = React.createClass({
    toggleTrackingType: function(){
        var futureTrackingType = (this.props.settings.tt === 'b') ? 'a' : 'b';
        socket.emit('setTrackingType', {tid: this.props.tid, type: futureTrackingType});
    },
    render: function(){
        var AdvancedTrackingCheckbox = (this.props.settings.tt === 'b') ?
            <input type="checkbox" className="regular-radio" onClick={this.toggleTrackingType} id="trackingCheckbox"></input> :
            <input type="checkbox" className="regular-radio" onChange={function(){}} onClick={this.toggleTrackingType} checked id="trackingCheckbox"></input>


        return(
            <div id="settings">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th data-field="Setting">Setting</th>
                            <th data-field="Toggle">Toggle</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <h3>Advanced Tracking</h3><br />
                                <p>Advanced tracking allows you to see your viewers in real time, live.
                                this is a alpha feature and is not reccomended without testing first.</p>
                            </td>
                            <td>
                                {AdvancedTrackingCheckbox}
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        );
    }
});
/*jshint ignore:end*/

module.exports = Settings;
