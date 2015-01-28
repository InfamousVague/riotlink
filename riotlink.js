var express = require('express'),
    app = express(),
    jade = require('jade'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    shortId = require('shortid'),
    mongoose = require('mongoose'),
    geoip = require('geoip-lite'),
    everyauth = require('everyauth'),
    conf = require('./conf'),
    everyauthRoot = __dirname + '/..',
    bodyparser = require('body-parser'),
    cookieparser = require('cookie-parser'),
    session = require('express-session'),
    totalConnections = 0;



//
// Everyauth
//
everyauth.debug = true;
var usersById = {};
var nextUserId = 0;
var usersByTwitId = {};
var usersByGoogleId = {};
var usersByFbId = {};

function addUser (source, sourceUser) {
  var user;
  if (arguments.length === 1) { // password-based
    user = sourceUser = source;
    user.id = ++nextUserId;
    return usersById[nextUserId] = user;
  } else { // non-password-based
    user = usersById[++nextUserId] = {id: nextUserId};
    user[source] = sourceUser;
  }
  return user;
}

var checkAuth = function(requestUser, callback){
    if(typeof(requestUser) === 'undefined'){
        callback(true, {});
    }else{
        if(typeof(requestUser.twitter) != 'undefined'){
            callback(false, {service: 'twitter', userid: requestUser.twitter.id});
        }else if(typeof(requestUser.google) != 'undefined'){
            callback(false, {service: 'google', userid: requestUser.google.id});
        }else if(typeof(requestUser.facebook) != 'undefined'){
            callback(false, {service: 'facebook', userid: requestUser.facebook.id});
        }
    }
};

everyauth
    .twitter
        .consumerKey(conf.twit.consumerKey)
        .consumerSecret(conf.twit.consumerSecret)
        .findOrCreateUser( function (sess, accessToken, accessSecret, twitUser) {
            return usersByTwitId[twitUser.id] || (usersByTwitId[twitUser.id] = addUser('twitter', twitUser));
        })
        .redirectPath('/');


everyauth
    .facebook
        .appId(conf.fb.appId)
        .appSecret(conf.fb.appSecret)
        .findOrCreateUser( function (session, accessToken, accessTokenExtra, fbUserMetadata) {
            return usersByFbId[fbUserMetadata.id] || (usersByFbId[fbUserMetadata.id] = addUser('facebook', fbUserMetadata));
        })
        .redirectPath('/');


everyauth
    .google
        .appId(conf.google.clientId)
        .appSecret(conf.google.clientSecret)
        .scope('https://www.googleapis.com/auth/userinfo.profile https://www.google.com/m8/feeds/')
        .findOrCreateUser( function (sess, accessToken, extra, googleUser) {
            googleUser.refreshToken = extra.refresh_token;
            googleUser.expiresIn = extra.expires_in;
            return usersByGoogleId[googleUser.id] || (usersByGoogleId[googleUser.id] = addUser('google', googleUser));
        })
        .redirectPath('/');

everyauth.everymodule
  .findUserById( function (id, callback) {
    callback(null, usersById[id]);
  });

//


//
// Mongoose stuff
//
mongoose.connect('mongodb://localhost/riotlink');

var Schema      = mongoose.Schema,
    ObjectId    = Schema.ObjectId;

var RiotLink = new Schema({
    rid             : String,
    tid             : String,
    link            : String,
    tt              : String,
    totalViews      : Number,
    currentViews    : Number,
    views           : Array
});
mongoose.model('RiotLink', RiotLink);
var RiotLink = mongoose.model('RiotLink');

var RiotUser = new Schema({
    service       : String,
    userid        : String,
    links         : Array
});
mongoose.model('RiotUser', RiotUser);
var RiotUser = mongoose.model('RiotUser');

//

//
// Express Configuration
//
app.use(express.static(__dirname + '/public'));
app.use(bodyparser())
    .use(cookieparser('mr ripley'))
    .use(session())
    .use(everyauth.middleware(app));

//

app.get('/', function(req, res){
    if(typeof(req.user) != 'undefined'){
        RiotLink.count({}, function( err, count){
            checkAuth(req.user, function(err, options){
                res.redirect('h?lt=' + count + '&u=' + options.service);
            });
        });
    }else{
        RiotLink.count({}, function( err, count){
            res.redirect('h?lt=' + count + '&u=' + false);
        });
    }
});

app.get('/usercheck', function(req, res){
    checkAuth(req.user, function(err, options){
        if(err){
            console.log('err checking userauth!');
            res.send('error!');
        }else{
            console.log('Authenticated with: ' + options.service + ' as user ' + options.userid);
            res.send('Authenticated with: ' + options.service + ' as user ' + options.v);
        }
    });
});

app.get('/t/:t', function(req, res){
    checkAuth(req.user, function(err, options){
        res.redirect('/tracker.html?tid=' + req.params.t + '&uid=' + options.userid);
    });
});

app.get('/r/:r', function(req,res){

    // Geolocate
    var geo = geoip.lookup(req.connection.remoteAddress);
    var query  = RiotLink.where({ rid: req.params.r });

    // Get the domain to determine social site
    var referer_clean = 'unknown';
    if(typeof(req.headers.referer) != 'undefined'){
        switch(req.headers.referer.split('/')[2]){
            case 't.co':
                referer_clean = "Twitter";
                break;

            case 'twitter.com':
                referer_clean = "Twitter";
                break;

            case 'lm.facebook.com':
                referer_clean = "Facebook";
                break;

            case 'www.facebook.com':
                referer_clean = "Facebook";
                break;

            case 'www.google.com':
                referer_clean = "Google";
                break;

            default:
                referer_clean = "Unknown";
                break;
        }
    }

    // Find the link matching rid provided
    query.findOne(function (err, link) {
        if (err) return handleError(err);
        if (link) {
            link.totalViews++;
            link.views.push({
                sessionID   : shortId.generate(),
                referer     : req.headers.referer,
                referer_c   : referer_clean,
                geo         : geo,
                timestamp   : new Date().getTime()
            });
            var goto = (link.tt === 'b') ? link.link : '/viewer.html?rid=' + link.rid + '&link=' + link.link;
            link.save(function(){
                res.redirect(goto);
            });
        }
    });

});


app.get('/minify', function(req, res){
    var rid     = shortId.generate(),
        tid     = shortId.generate(),
        link    = req.query.link,
        tt      = req.query.tt;

    if(typeof(req.user) != 'undefined'){
        checkAuth(req.user, function(err, options){
            var query  = RiotUser.where({ userid: options.userid });
            query.findOne(function (err, user) {
                if (user === null) {
                    var User = new RiotUser({
                        service : options.service,
                        userid  : options.userid,
                        links   : [{
                            rid : rid,
                            tid : tid,
                            tt  : tt,
                            link: link
                        }]
                    });
                    User.save(function(err){
                        var Link = new RiotLink({
                            rid             : rid,
                            tid             : tid,
                            link            : link,
                            tt              : tt,
                            totalViews      : 0,
                            currentViews    : 0,
                            views           : []
                        });

                        Link.save(function (err) {
                            res.redirect('./viewer.html?rid=' + rid + '&tid=' + tid + '&link=' + link + '&tt=' + tt);
                        });
                    });
                }else{
                    user.links.push({
                        rid : rid,
                        tid : tid,
                        tt  : tt,
                        link: link
                    });
                    user.save(function(err){
                        var Link = new RiotLink({
                            rid             : rid,
                            tid             : tid,
                            link            : link,
                            tt              : tt,
                            totalViews      : 0,
                            currentViews    : 0,
                            views           : []
                        });

                        Link.save(function (err) {
                            res.redirect('./viewer.html?rid=' + rid + '&tid=' + tid + '&link=' + link + '&tt=' + tt);
                        });
                    });
                }
            });
        });
    }else{
        var Link = new RiotLink({
            rid             : rid,
            tid             : tid,
            link            : link,
            tt              : tt,
            totalViews      : 0,
            currentViews    : 0,
            views           : []
        });

        Link.save(function (err) {
            res.redirect('./viewer.html?rid=' + rid + '&tid=' + tid + '&link=' + link + '&tt=' + tt);
        });
    }
});

io.on('connection', function(socket){
    var rid = "unknown";

    socket.on('setTrackingType', function(options){
        var query = RiotLink.where({tid: options.tid});
        console.log(options);
        console.log(options.tid + ' request to change ' + options.type);
        query.findOne(function(err, link){
            if (err) return handleError(err);
            if (link){
                link.tt = options.type;
                link.save();
            }
        });
    });

    // on connection add a view and a live view
    socket.on('connected', function(options){
        totalConnections++;
        //console.log('user ' + totalConnections + ' connected!');
        rid = options.rid;
        var query  = RiotLink.where({ rid: rid });
        query.findOne(function (err, link) {
            if (err) return handleError(err);
            if (link) {
                link.currentViews++;
                link.save();
            }
        });
    });

    socket.on('requestUserData', function(userid){
        var query = RiotUser.where({ userid: userid });
        query.findOne(function(err, user){
            if (err) return handleError(err);
            if (user) {
                socket.emit('newUserData', {
                    links   : user.links.reverse()
                });
            }
        });
    });

    socket.on('requestData', function(tid){
        var query  = RiotLink.where({ tid: tid });
        query.findOne(function (err, link) {
            if (err) return handleError(err);
            if (link) {
                socket.emit('newData', {
                    totalViews      : link.totalViews,
                    currentViews    : link.currentViews,
                    views           : link.views,
                    rid             : link.rid,
                    tt              : link.tt
                });
            }
        });
    });


    // on disconnect remove the live view
    socket.on('disconnect', function(){
        var query  = RiotLink.where({ rid: rid });
        query.findOne(function (err, link) {
            if (err) return handleError(err);
            if (link) {
                link.currentViews--;
                link.save();
            }
        });
    });
});

http.listen(process.argv[2], function(){
    console.log('listening on *:' + process.argv[2]);
});
