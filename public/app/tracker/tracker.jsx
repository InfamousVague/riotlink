/** @jsx React.DOM */

var React           = require('react'),
    CurrentViews    = require('./global/currentViews.jsx'),
    AllViews        = require('./global/allViews.jsx');


/*jshint ignore:start*/
var Page = React.createClass({
    render: function(){
        return(
            <div className="reactBody">
                <CurrentViews />
            </div>
        );
    }
});

React.renderComponent(
    <Page />,
    document.getElementById('render')
);
/*jshint ignore:end*/
