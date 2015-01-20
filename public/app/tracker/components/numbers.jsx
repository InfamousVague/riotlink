/** @jsx React.DOM */

var React = require('react');

/*jshint ignore:start*/
var Numbers = React.createClass({
    render: function(){
        return(
            <div id="numbers">
                <div className="row">
                    <div className="col-xs-12 col-sm-3 viewModule">
                        <div className="col-xs-7 totalViews">
                            <h2 className="number">{this.props.totalViews}</h2>
                            <p className="isa">Total Views</p>
                        </div>
                        <div className="col-xs-5 totalViews">
                            <i className="fa fa-twitter"></i>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 viewModule">
                        <div className="col-xs-7 twitterViews">
                            <h2 className="number">{this.props.socialViews.twitter}</h2>
                            <p className="isa">Twitter Views</p>
                        </div>
                        <div className="col-xs-5 twitterViews">
                            <i className="fa fa-twitter"></i>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 viewModule">
                        <div className="col-xs-7 facebookViews">
                            <h2 className="number">{this.props.socialViews.facebook}</h2>
                            <p className="isa">Facebook Views</p>
                        </div>
                        <div className="col-xs-5 facebookViews">
                            <i className="fa fa-twitter"></i>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 viewModule">
                        <div className="col-xs-7 googleViews">
                            <h2 className="number">{this.props.socialViews.google}</h2>
                            <p className="isa">Google Views</p>
                        </div>
                        <div className="col-xs-5 googleViews">
                            <i className="fa fa-twitter"></i>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
/*jshint ignore:end*/

module.exports = Numbers;
