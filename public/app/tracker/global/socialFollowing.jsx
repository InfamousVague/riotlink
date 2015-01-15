/** @jsx React.DOM */

var React = require('react');

/*jshint ignore:start*/
var SocialFollowing = React.createClass({
    render: function(){
        return(
            <div id="allViews">
                <div className="row_container social">
                    <p className="leftView"><span id="twitterViews">0</span></p>
                    <label className="right"><i className="fa fa-twitter"></i> Views</label>
                </div>
                <div className="row_container social">
                    <p className="leftView"><span id="facebookViews">0</span></p>
                    <label className="right"><i className="fa fa-facebook"></i> Views</label>
                </div>
                <div className="row_container social">
                    <p className="leftView"><span id="googlePlusViews">0</span></p>
                    <label className="right"><i className="fa fa-google-plus"></i> Views</label>
                </div>
            </div>
        );
    }
});
/*jshint ignore:end*/

module.exports = SocialFollowing;
