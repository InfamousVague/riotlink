/** @jsx React.DOM */

var React               = require('react'),
    TrackerActions      = require('./actions/Actions.jsx'),
    Sidebar             = require('./requires/sidebar.jsx'),
    Numbers             = require('./requires/numbers.jsx'),
    Map                 = require('./requires/map.jsx'),
    ViewsChart          = require('./requires/viewsChart.jsx'),
    AdvancedPanel       = require('./requires/advancedPanel.jsx'),
    AdvancedPanelOff    = require('./requires/advancedPanelOff.jsx'),
    AllLinks            = require('./requires/allLinks.jsx'),
    Settings            = require('./requires/settings.jsx'),
    socket              = io();

var tid = TrackerActions.getUrlVars(window.location.href)['tid'];
var uid = TrackerActions.getUrlVars(window.location.href)['uid'];

/*jshint ignore:start*/
var Page = React.createClass({
    getInitialState: function(){
        return{
            currentViews    : 0,
            links           : [],
            viewsData       : {},
            settings        : {
                    tt      : 'b'
                },
            totalViews      : 0,
            socialViews     : {
                twitter     : {
                    numbers : 0,
                    percent : 0
                },
                facebook    : {
                    numbers : 0,
                    percent : 0
                },
                google      : {
                    numbers : 0,
                    percent : 0
                }
            }
        };
    },
    componentDidMount: function(){
        var doc     = $(document),
            that    = this;

        TrackerActions.init(doc);
        TrackerActions.statsButton(doc);
        TrackerActions.geoButton(doc, function(){
            map.invalidateSize(false);
        });
        TrackerActions.linkButton(doc);
        TrackerActions.settingsButton(doc);
        TrackerActions.pollData(tid, uid, 1000);

        window.history.replaceState('Object', 'Title', 't/' + tid);

        /*==================
        =     Map          =
        ==================*/
        var map = L.map('map').setView([38, -103], 4);
        L.tileLayer('http://{s}.tiles.mapbox.com/v3/examples.map-i87786ca/{z}/{x}/{y}.png', {
            attribution: 'Riotlink Views',
            maxZoom: 18
        }).addTo(map);
        var markerGroup = L.layerGroup();

        /*==================
        =    User Page     =
        ==================*/
        socket.on('newUserData', function(data){
            that.setState({links: data.links});
        });


        /*==================
        =    Views/Map     =
        ==================*/

        socket.on('newData', function(data){
            var twitterViews = 0,
                facebookViews = 0,
                googlePlusViews = 0,
                viewsTimestamps = [],
                tempViewsData   = {},
                tempViewsArray  = [];

            markerGroup.clearLayers();
            data.views.map(function(view){
                if ( typeof( tempViewsData[ TrackerActions.timeConverter( view.timestamp ) ] ) === 'undefined' )
                    tempViewsData[ TrackerActions.timeConverter( view.timestamp ) ] = 0;

                tempViewsData[ TrackerActions.timeConverter( view.timestamp ) ]++;

                if(!!view.geo)
                    L.marker(view.geo.ll).addTo(markerGroup);

                if(view.referer_c === "Twitter") twitterViews++;
                if(view.referer_c === "Facebook") facebookViews++;
                if(view.referer_c === "Google") googlePlusViews++;
            });
            markerGroup.addTo(map);

            for (var key in tempViewsData) {
                tempViewsArray.push({date: key.toString().slice(0, -4) + key.toString().slice(-2), close: tempViewsData[key]});
            }

            that.setState({
                currentViews    : data.currentViews,
                totalViews      : data.totalViews,
                viewsData       : tempViewsArray,
                rid             : data.rid,
                settings        : {
                        tt      : data.tt
                    },
                socialViews     : {
                    twitter     : {
                        numbers : twitterViews,
                        percent : (twitterViews === 0) ? 0 : Math.floor((twitterViews / data.totalViews) * 100),
                    },
                    facebook    : {
                        numbers : facebookViews,
                        percent : (facebookViews === 0) ? 0 : Math.floor((facebookViews / data.totalViews) * 100),
                    },
                    google      : {
                        numbers : googlePlusViews,
                        percent : (googlePlusViews === 0) ? 0 : Math.floor((googlePlusViews / data.totalViews) * 100),
                    }
                }
            });
        });
    },
    render: function(){
        var allLinks;
        if(uid && uid != 'undefined'){
            allLinks = <AllLinks links={this.state.links} />;
        }else{
            allLinks = <p>Please login to view link history</p>;
        }

        var trackingStatus = (this.state.settings.tt === 'b') ? '( inactive )' : '';
        var advancedTrackingPanel = (this.state.settings.tt === 'b') ? <AdvancedPanelOff /> : <AdvancedPanel currentViews={this.state.currentViews}/>
        return(
            <div className="reactBody tracker">
                <div className="container-fluid fullHeight">
                    <div className="col-md-2 fullHeight noLeft">
                        <Sidebar />
                    </div>
                    <div id="stats" className="col-md-10 overflowAuto">
                        <div className="row">
                            <div className="col-xs-12 col-sm-2">
                                <h1 className="pageTitle">Statistics</h1>
                            </div>
                            <div className="col-xs-12 col-sm-10">
                                <div className="shareLink">
                                    Share: <span className="linkGrey">{'http://rls.li/r/' + this.state.rid}</span>
                                </div>
                            </div>
                        </div>

                        <ol className="breadcrumb">
                            <li>Tracker</li>
                            <li className="active">Statistics</li>
                        </ol>
                        <Numbers totalViews={this.state.totalViews} socialViews={this.state.socialViews} />

                        <div className="autoWrapper">
                            <div className="col-xs-12 col-sm-6 graph">
                                <h2 className="bannerTitleBar">Views by date</h2>
                                <ViewsChart viewsData={this.state.viewsData} />
                            </div>

                            <div className="col-xs-12 col-sm-6 graph2">
                                <h2 className="bannerTitleBar">Advanced Tracking {trackingStatus}</h2>
                                {advancedTrackingPanel}
                            </div>
                        </div>
                    </div>
                    <div id="mapHolder" className="col-md-10">
                        <div className="row">
                            <div className="col-xs-12 col-sm-2">
                                <h1 className="pageTitle">Geolocation</h1>
                            </div>
                            <div className="col-xs-12 col-sm-10">
                                <div className="shareLink">
                                    Share: <span className="linkGrey">{'http://rls.li/r/' + this.state.rid}</span>
                                </div>
                            </div>
                        </div>
                            <ol className="breadcrumb">
                            <li>Tracker</li>
                            <li className="active">Location Map</li>
                        </ol>
                        <Map />
                    </div>
                    <div id="allLinksHolder" className="col-md-10 overflowAuto">
                        <div className="row">
                            <div className="col-xs-12 col-sm-2">
                                <h1 className="pageTitle">Link&nbsp;History</h1>
                            </div>
                            <div className="col-xs-12 col-sm-10">
                                <div className="shareLink">
                                    Share: <span className="linkGrey">{'http://rls.li/r/' + this.state.rid}</span>
                                </div>
                            </div>
                        </div>
                            <ol className="breadcrumb">
                            <li>Tracker</li>
                            <li className="active">All Links</li>
                        </ol>

                        {allLinks}

                    </div>
                    <div id="settings" className="col-md-10 overflowAuto">
                        <div className="row">
                            <div className="col-xs-12 col-sm-2">
                                <h1 className="pageTitle">Settings</h1>
                            </div>
                            <div className="col-xs-12 col-sm-10">
                                <div className="shareLink">
                                    Share: <span className="linkGrey">{'http://rls.li/r/' + this.state.rid}</span>
                                </div>
                            </div>
                        </div>
                            <ol className="breadcrumb">
                                <li>Tracker</li>
                                <li className="active">Settings</li>
                            </ol>
                        <Settings settings={this.state.settings} tid={tid}/>
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
