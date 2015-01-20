(function(){
    $('#trackingCheckbox').click(function(){
        if($(this).is(":checked")){
            $('.trackingMode').html('advanced tracking on');
        }else{
            $('.trackingMode').html('advanced tracking off');
        }
    });

    $('#track').click(function(){
        var tt          = ($('#trackingCheckbox').is(":checked")) ? "a" : "b",
        link        = $('#link').val(),
        builtURL    = "/minify?tt=" + tt + "&link=" + link;

        window.location = builtURL;
    });
    // adding enter key functionality
    $('#link').keypress(function(e){
        if(e.which == 13){
            $('#track').click();
        }
    });
})();
