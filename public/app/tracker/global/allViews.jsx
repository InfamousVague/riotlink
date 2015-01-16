/** @jsx React.DOM */

var React = require('react');

/*jshint ignore:start*/
var AllViews = React.createClass({
    render: function(){
        return(
            <div id="allViews">
                <div className="row_container">
                    <label className="left">Total&nbsp;Views:</label>
                    <p className="rightView"><span className="view" id="totalViewsHolder">{this.props.totalViews}</span></p>
                </div>
            </div>
        );
    }
});
/*jshint ignore:end*/

module.exports = AllViews;
