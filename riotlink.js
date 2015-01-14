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
    currentViews    : Number
});
mongoose.model('RiotLink', RiotLink);
var RiotLink = mongoose.model('RiotLink');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.redirect('h');
});

app.get('/r', function(req,res){
    var query  = RiotLink.where({ rid: req.query.r });
    query.findOne(function (err, link) {
        if (err) return handleError(err);
        if (link) {
            // doc may be null if no document matched
            res.redirect(link.link);
        }
    });

});

app.get('/view', function(req, res){
    // check the db for if this link is advanced or not
    res.redirect('./viewer.html?rid=' + req.query.rid + '&tid=' + req.query.tid + '&link=' + req.query.link + '&tt=' + req.query.tt);

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
        currentViews    : 0
    });

    Link.save(function (err) {
        res.redirect('./view?rid=' + rid + '&tid=' + tid + '&link=' + link + '&tt=' + tt);
    });
});

io.on('connection', function(socket){
    console.log('connection made');
});

http.listen(process.argv[2], function(){
    console.log('listening on *:' + process.argv[2]);
});
