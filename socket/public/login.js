$(function() {

    $('.login-form-link').click(function(e) {
        $("#login-form").delay(200).fadeIn(200);
        
        if ($("#panel2").is(":visible")) {
            $("#panel2").fadeOut(200);
            $("#panel1").delay(200).fadeIn(200);
            $(".login-form-link").addClass('active');
        } else {
            $("#register-form").fadeOut(200);
            $('.register-form-link').removeClass('active');
            $(".login-form-link").addClass('active');
        }
        
        e.preventDefault();
    });

    $('.register-form-link').click(function(e) {

        $("#register-form").delay(200).fadeIn(200);
        if ($("#panel2").is(":visible")) {
            $("#panel2").fadeOut(200);
            $("#panel1").delay(200).fadeIn(200);
            $(".register-form-link").addClass('active');
        } else {
            $("#login-form").fadeOut(200);
            $('.login-form-link').removeClass('active');
            $(".register-form-link").addClass('active');
        }
        
        e.preventDefault();
    });


    $('#forgot-pass').click(function(e) {
        $("#panel2").delay(200).fadeIn(200);
        $("#register-form").fadeOut(200);
        $("#login-form").fadeOut(200);
        $("#panel1").fadeOut(200);
        $('.login-form-link').removeClass('active');
        $('.register-form-link').removeClass('active');
        e.preventDefault();
    });

});
