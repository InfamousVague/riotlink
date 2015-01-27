/** @jsx React.DOM */

var React = require('react');

/*jshint ignore:start*/
var allLinks = React.createClass({
    render: function(){
        var allLinks = this.props.links.map(function(link){
            return(
                <tr>
                    <td>{link.link}</td>
                    <td>{'http://rls.li/r/' + link.rid}</td>
                    <td>
                        <a href={'http://rls.li/t/' + link.tid}>
                            <button className="default-button">Track</button>
                        </a>
                    </td>
                </tr>
            );
        });
        return(
            <div id="allLinks">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th data-field="link">Full Link</th>
                            <th data-field="share">Share Link</th>
                            <th data-field="track">Track</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allLinks}
                    </tbody>
                </table>
            </div>
        );
    }
});
/*jshint ignore:end*/

module.exports = allLinks;
