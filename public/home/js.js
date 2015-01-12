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
})();
