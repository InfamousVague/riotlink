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


app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');    
});
