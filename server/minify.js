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
