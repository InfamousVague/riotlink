var express = require('express'),
    app = express(),
    jade = require('jade'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    shortId = require('shortid'),
    mongoose = require('mongoose');


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
    res.redirect('h');
});

app.get('/t', function(req, res){
    res.redirect('./tracker.html?tid=' + req.query.t);
});

app.get('/r', function(req,res){
    var query  = RiotLink.where({ rid: req.query.r });

    // Get the domain to determine social site
    var referer_clean = 'unknown';
    if(typeof(req.headers.referer) != 'undefined'){
        switch(req.headers.referer.split('/')[2]){
            case 't.co':
                referer_clean = "Twitter";
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
                referer     : req.headers.referer,
                referer_c   : referer_clean,
                timestamp   : new Date().getTime()
            });
            var goto = (link.tt === 'b') ? link.link : './viewer.html?rid=' + link.rid + '&link=' + link.link;
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
                    views           : link.views
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
