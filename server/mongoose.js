mongoose.connect('mongodb://localhost/riotlink');

var Schema      = mongoose.Schema,
    ObjectId    = Schema.ObjectId;

var RiotLink = new Schema({
    rid             : String,
    tid             : String,
    link            : String,
    tt              : String,
    totalViews      : Number,
    currentViews    : Number,
    views           : Array
});
mongoose.model('RiotLink', RiotLink);
var RiotLink = mongoose.model('RiotLink');

var RiotUser = new Schema({
    service       : String,
    userid        : String,
    links         : Array
});
mongoose.model('RiotUser', RiotUser);
var RiotUser = mongoose.model('RiotUser');
