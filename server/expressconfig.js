app.use(express.static(__dirname + '/public'));
app.use(bodyparser())
    .use(cookieparser('mr ripley'))
    .use(session())
    .use(everyauth.middleware(app));
