(function(){
    $('body').css({
        'background': 'url("backgrounds/' + (Math.floor( Math.random() * 6 ) + 1) + '.jpeg")',
        'background-size': 'cover'
    });

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
            builtURL    = window.location.origin + "?tt=" + tt + "&link=" + link;

        alert(builtURL);
    });
})();
