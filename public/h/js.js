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
        $('.username').html(username);
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

$(document).ready(function(){
    $(".app-launcher").toggle();
      var scroll = false;
      var launcherMaxHeight = 396;
      var launcherMinHeight = 296;

      // Mousewheel event handler to detect whether user has scrolled over the container
      $('.apps').bind('mousewheel', function(e){
            if(e.originalEvent.wheelDelta /120 > 0) {
              // Scrolling up
            }
            else{
                // Scrolling down
                if(!scroll){
                    $(".second-set").show();
                    $('.apps').css({height: launcherMinHeight}).addClass('overflow');
                    scroll =true;
                    $(this).scrollTop(e.originalEvent.wheelDelta);
                }
            }
        });

      // Scroll event to detect that scrollbar reached top of the container
      $('.apps').scroll(function(){
        var pos=$(this).scrollTop();
        if(pos == 0){
            scroll =false;
            $('.apps').css({height: launcherMaxHeight}).removeClass('overflow');
            $(".second-set").hide();
        }
      });

      // Click event handler to show more apps
      $('.apps .more').click(function(){
        $(".second-set").show();
        $(".apps").animate({ scrollTop: $('.apps')[0].scrollHeight}).css({height: 296}).addClass('overflow');
      });

      // Click event handler to toggle dropdown
      $(".launchButton").click(function(event){
        event.stopPropagation();
        $(".app-launcher").toggle();
      });

      $(document).click(function() {
        //Hide the launcher if visible
        $('.app-launcher').hide();
        });

        // Prevent hiding on click inside app launcher
        $('.app-launcher').click(function(event){
            event.stopPropagation();
        });

});

// Resize event handler to maintain the max-height of the app launcher
$(window).resize(function(){
        $('.apps').css({maxHeight: $(window).height() - $('.apps').offset().top});
});
