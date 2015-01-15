/** @jsx React.DOM */

var React           = require('react'),
    CurrentViews    = require('./global/currentViews.jsx'),
    AllViews        = require('./global/allViews.jsx'),
    SocialFollowing = require('./global/socialFollowing.jsx');


/*jshint ignore:start*/
var Page = React.createClass({
    render: function(){
        return(
            <div className="reactBody">
                <div className="row">
                    <div className="col-xs-12 col-sm-6">
                        <CurrentViews />
                    </div>
                    <div className="col-xs-12 col-sm-6">
                        <AllViews />
                        <SocialFollowing />
                    </div>
                </div>
            </div>
        );
    }
});

React.renderComponent(
    <Page />,
    document.getElementById('render')
);
/*jshint ignore:end*/
