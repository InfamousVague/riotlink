var express = require('express');
var app = express();
var jade = require('jade');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.redirect('home');
});

app.get('/view', function(req, res){
    if(req.query.tt === "a"){
        res.redirect('./viewer.html?rid=' + req.query.rid);
    }else{

    }
});

io.on('connection', function(socket){

});

http.listen(5560, function(){
    console.log('listening on *:5560');
});
