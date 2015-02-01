/** @jsx React.DOM */
var socket = io();

var TrackerActions = {
    getUrlVars: function(w_href){
        var vars = {};
        var parts = w_href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    },
    init: function(doc, wind, tid){
        doc.find('#mapHolder').hide();
        doc.find('#settings').hide();
        doc.find('#allLinksHolder').hide();

        socket.emit('setVals', {
            tid : tid
        });
    },
    resetView: function(doc){
        doc.find('#sidebar ul li').removeClass('active');
        doc.find('#mapHolder').hide();
        doc.find('#settings').hide();
        doc.find('#allLinksHolder').hide();
        doc.find('#stats').hide();
    },
    statsButton: function(doc){
        var that     = this,
            that_doc = doc;
        doc.find('#statsButton').click(function(){
            that.resetView(that_doc);
            $(this).addClass('active');
            $('#stats').show();
        });
    },
    geoButton: function(doc, callback){
        var that     = this,
            that_doc = doc;
        doc.find('#geoButton').click(function(){
            that.resetView(that_doc);
            $(this).addClass('active');
            $('#mapHolder').show();
            callback();
        });
    },
    linkButton: function(doc){
        var that     = this,
            that_doc = doc;
        doc.find('#linksButton').click(function(){
            that.resetView(that_doc);
            $(this).addClass('active');
            $('#allLinksHolder').show();
        });
    },
    settingsButton: function(doc){
        var that     = this,
            that_doc = doc;
        doc.find('#settingsButton').click(function(){
            that.resetView(that_doc);
            $(this).addClass('active');
            $('#settings').show();
        });
    },
    timeConverter: function(UNIX_timestamp){
        var a = new Date(UNIX_timestamp);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + '-' + month + '-' + year;
        return time;
    },
    pollData: function(tid, uid, howOften){
        setInterval(function(){
            socket.emit('requestData', tid);

            if(uid)
                socket.emit('requestUserData', uid);

        }, howOften);
    }
};


module.exports = TrackerActions;
