var express = require('express'),
    app = express(),
    jade = require('jade'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    shortId = require('shortid'),
    mongoose = require('mongoose'),
    geoip = require('geoip-lite'),
    totalConnections = 0;

// Mongoose stuff

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

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    RiotLink.count({}, function( err, count){
        res.redirect('h?lt=' + count);
    })
});

app.get('/t/:t', function(req, res){
    res.redirect('/tracker.html?tid=' + req.params.t);
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

io.on('connection', function(socket){
    var rid = "unknown";

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


    socket.on('requestData', function(tid){
        var query  = RiotLink.where({ tid: tid });
        query.findOne(function (err, link) {
            if (err) return handleError(err);
            if (link) {
                socket.emit('newData', {
                    totalViews      : link.totalViews,
                    currentViews    : link.currentViews,
                    views           : link.views,
                    rid             : link.rid
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
