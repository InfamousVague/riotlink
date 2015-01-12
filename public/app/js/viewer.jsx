/** @jsx React.DOM */

var React   = require('react');

/*jshint ignore:start*/
var Page = React.createClass({
    render: function(){
        return(
            <div className="reactBody">
                <span className="blue">Everything works if this is blue.</span>
            </div>
        );
    }
});

React.renderComponent(
    <Page />,
    document.getElementById('render')
);
/*jshint ignore:end*/
