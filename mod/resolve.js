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
