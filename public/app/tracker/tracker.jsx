/** @jsx React.DOM */

var React       = require('react');

/*jshint ignore:start*/
var Page = React.createClass({
    render: function(){
        return(
            <div className="reactBody">
                <p>Tracker</p>
            </div>
        );
    }
});

React.renderComponent(
    <Page />,
    document.getElementById('render')
);
/*jshint ignore:end*/
