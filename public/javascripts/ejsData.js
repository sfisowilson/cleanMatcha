$(document).ready(function(){
    // $('.status').delay(5000).fadeOut('slow');

    $('.register').click(function(){
        $('#registerBtn').click();
    });

    $('.login').click(function(){
        let btn = $(this).attr('data-for');
        $('#'+btn).click();
    });
});