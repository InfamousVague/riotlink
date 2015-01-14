/** @jsx React.DOM */

var React           = require('react'),
    CurrentViews    = require('./global/currentViews.jsx'),
    AllViews        = require('./global/allViews.jsx');


/*jshint ignore:start*/
var Page = React.createClass({
    render: function(){
        return(
            <div className="reactBody">
                <div className="container">
                    <div className="row">
                        <div class="col-md-3">
                            <AllViews />
                            <CurrentViews />
                        </div>
                        <div class="col-md-3">

                        </div>
                        <div class="col-md-6">

                        </div>
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
