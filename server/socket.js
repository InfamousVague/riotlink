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
