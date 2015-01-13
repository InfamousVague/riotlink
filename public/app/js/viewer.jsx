/** @jsx React.DOM */

var React       = require('react');
var ViewToolbar = require('./global/viewToolbar.jsx');

/*jshint ignore:start*/
var Page = React.createClass({
    render: function(){
        return(
            <div className="reactBody">
                <ViewToolbar />
                <iframe border="0" height="100%" width="100%" src="null" id="site"></iframe>
            </div>
        );
    }
});

React.renderComponent(
    <Page />,
    document.getElementById('render')
);
/*jshint ignore:end*/
