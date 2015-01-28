app.get('/t/:t', function(req, res){
    checkAuth(req.user, function(err, options){
        res.redirect('/tracker.html?tid=' + req.params.t + '&uid=' + options.userid);
    });
});
