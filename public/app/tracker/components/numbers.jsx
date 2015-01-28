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
                            <p className="isa">Total&nbsp;Views</p>
                        </div>
                        <div className="col-xs-5 totalViews">
                            <i className="fa fa-eye"></i>
                        </div>
                        <div className="col-xs-12 percentBar">
                            <p>
                                &nbsp;
                            </p>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 viewModule">
                        <div className="col-xs-7 twitterViews">
                            <h2 className="number">{this.props.socialViews.twitter.numbers}</h2>
                            <p className="isa">Twitter&nbsp;Views</p>
                        </div>
                        <div className="col-xs-5 twitterViews">
                            <i className="fa fa-twitter"></i>
                        </div>
                        <div className="col-xs-12 percentBar twitterPercent">
                            <div className="sliderBar" style={{'width': this.props.socialViews.twitter.percent + '%'}}></div>
                            <p>
                                {this.props.socialViews.twitter.percent}%
                            </p>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 viewModule">
                        <div className="col-xs-7 facebookViews">
                            <h2 className="number">{this.props.socialViews.facebook.numbers}</h2>
                            <p className="isa">Facebook&nbsp;Views</p>
                        </div>
                        <div className="col-xs-5 facebookViews">
                            <i className="fa fa-facebook"></i>
                        </div>
                        <div className="col-xs-12 percentBar facebookPercent">
                            <div className="sliderBar" style={{'width': this.props.socialViews.facebook.percent + '%'}}></div>
                            <p>
                                {this.props.socialViews.facebook.percent}%
                            </p>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-3 viewModule">
                        <div className="col-xs-7 googleViews">
                            <h2 className="number">{this.props.socialViews.google.numbers}</h2>
                            <p className="isa">Google&nbsp;Views</p>
                        </div>
                        <div className="col-xs-5 googleViews">
                            <i className="fa fa-google-plus"></i>
                        </div>
                        <div className="col-xs-12 percentBar googlePercent">
                            <div className="sliderBar" style={{'width': this.props.socialViews.google.percent + '%'}}></div>
                            <p>
                                {this.props.socialViews.google.percent}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
/*jshint ignore:end*/

module.exports = Numbers;
