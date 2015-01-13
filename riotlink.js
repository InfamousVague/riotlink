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

var ShortLink = new Schema({
    rid     : String,
    tid     : String,
    link    : String,
    tt      : String
});
mongoose.model('ShortLink', ShortLink);
var ShortLink = mongoose.model('ShortLink');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.redirect('home');
});

app.get('/r', function(req,res){
    var query  = ShortLink.where({ rid: req.query.r });
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
    res.redirect('./viewer.html?rid=' + req.query.rid + '&tid=' + req.query.tid + '&link=' + req.query.link);

});

app.get('/minify', function(req, res){
    var rid     = shortId.generate(),
        tid     = shortId.generate(),
        link    = req.query.link,
        tt      = req.query.tt;

    var Link = new ShortLink({
        rid     : rid,
        tid     : tid,
        link    : link,
        tt      : tt
    });

    Link.save(function (err) {
        res.redirect('./view?rid=' + rid + '&tid=' + tid + '&link=' + link);
    });
});

io.on('connection', function(socket){

});

http.listen(5560, function(){
    console.log('listening on *:5560');
});
