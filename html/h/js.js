function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
var linkCount = getUrlVars()['lt'];
var username  = getUrlVars()['u'];

$('.number').html(linkCount);
window.history.replaceState('Object', 'Title', '/h/');
if(typeof(linkCount) === 'undefined'){
    window.location = '/';
}
(function(){
    if (username != 'false'){
        $('#loginGroup').html('<a href="/logout"><button class="logoutButton">Logout</button></a>');
        $('#twitterLogin').attr('href', '#');
    }
    $('#trackingCheckbox').click(function(){
        if($(this).is(":checked")){
            $('.trackingMode').html('advanced tracking on');
        }else{
            $('.trackingMode').html('advanced tracking off');
        }
    });

    $('#track').click(function(){
        var tt      = ($('#trackingCheckbox').is(":checked")) ? "a" : "b",
            link    = $('#link').val(),
            builtURL;

        if (link.substring(0,7) === "http://" || link.substring(0,8) === "https://" ){
            builtURL = "/minify?tt=" + tt + "&link=" + link;
            window.location = builtURL;
        }else{
            builtURL    = "/minify?tt=" + tt + "&link=http://" + link;
            window.location = builtURL;
        }
    });
    // adding enter key functionality
    $('#link').keypress(function(e){
        if(e.which == 13){
            $('#track').click();
        }
    });
})();
