everyauth.debug = false;
var usersById = {};
var nextUserId = 0;
var usersByTwitId = {};
var usersByGoogleId = {};
var usersByFbId = {};

function addUser (source, sourceUser) {
  var user;
  if (arguments.length === 1) { // password-based
    user = sourceUser = source;
    user.id = ++nextUserId;
    return usersById[nextUserId] = user;
  } else { // non-password-based
    user = usersById[++nextUserId] = {id: nextUserId};
    user[source] = sourceUser;
  }
  return user;
}

var checkAuth = function(requestUser, callback){
    if(typeof(requestUser) === 'undefined'){
        callback(true, {});
    }else{
        if(typeof(requestUser.twitter) != 'undefined'){
            callback(false, {service: 'twitter', userid: requestUser.twitter.id});
        }else if(typeof(requestUser.google) != 'undefined'){
            callback(false, {service: 'google', userid: requestUser.google.id});
        }else if(typeof(requestUser.facebook) != 'undefined'){
            callback(false, {service: 'facebook', userid: requestUser.facebook.id});
        }
    }
};

everyauth
    .twitter
        .consumerKey(conf.twit.consumerKey)
        .consumerSecret(conf.twit.consumerSecret)
        .findOrCreateUser( function (sess, accessToken, accessSecret, twitUser) {
            return usersByTwitId[twitUser.id] || (usersByTwitId[twitUser.id] = addUser('twitter', twitUser));
        })
        .redirectPath('/');


everyauth
    .facebook
        .appId(conf.fb.appId)
        .appSecret(conf.fb.appSecret)
        .findOrCreateUser( function (session, accessToken, accessTokenExtra, fbUserMetadata) {
            return usersByFbId[fbUserMetadata.id] || (usersByFbId[fbUserMetadata.id] = addUser('facebook', fbUserMetadata));
        })
        .redirectPath('/');


everyauth
    .google
        .appId(conf.google.clientId)
        .appSecret(conf.google.clientSecret)
        .scope('https://www.googleapis.com/auth/userinfo.profile https://www.google.com/m8/feeds/')
        .findOrCreateUser( function (sess, accessToken, extra, googleUser) {
            googleUser.refreshToken = extra.refresh_token;
            googleUser.expiresIn = extra.expires_in;
            return usersByGoogleId[googleUser.id] || (usersByGoogleId[googleUser.id] = addUser('google', googleUser));
        })
        .redirectPath('/');

everyauth.everymodule
  .findUserById( function (id, callback) {
    callback(null, usersById[id]);
  });
