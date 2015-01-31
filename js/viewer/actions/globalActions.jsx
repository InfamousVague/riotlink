module.exports={
    testAction : function(){
        console.log('success');
    },
    getUrlVars : function() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }
};
