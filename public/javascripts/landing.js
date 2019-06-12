
$(document).ready(function(){
    $('#registerForm').submit(function (e) { 
        e.preventDefault();
        const user = makeObject($('#registerForm').serializeArray());
        // send data to DB
        register(user);
        console.log(user);
    });

    $('#loginForm').submit(function (e) { 
        e.preventDefault();
        const user = makeObject($('#loginForm').serializeArray());
        signin(user);
        console.log(user);
    });

    $('#renewPasswordForm').submit(function (e) { 
        e.preventDefault();
        const user = makeObject($('#renewPasswordForm').serializeArray());
        console.log(user.confirmPassword);
        console.log(user);
        if (user.password === user.confirmPassword)
            reset(user);
        else{
            $('#renewPasswordForm')[0].reset();
            $('.registerStatusButton').click();
            $('.status').html('<h1>Provided passwords don\'t match</h1><p>Try again!</p>');
        }
    });

    $('#renewPassword').submit(function (e) { 
        e.preventDefault();
        const user = makeObject($('#renewPassword').serializeArray());
        renewPassword(user);
        
    });

    $('.forgotPassButton').click(function (e) { 
        e.preventDefault();
        $('#loginForm').fadeOut();
        $('.forgotPassButton').fadeOut();
        $('#renewPassword').fadeIn();
        $('.loginTitle').text('Renew Password');
        $('.login').attr('data-for','renewBtn').text('Request new Password');
    });

    $(document).on('click', ".resend", function(){
        console.log('please resend email to ' + $(this).attr('data-email'));
        resendVerification($(this).attr('data-email'));
    });

    $('.selectPic').click(function(e){
        e.preventDefault();
        $('#profile').click();
    })
    $('#profile').change(function (e) { 
        e.preventDefault();

        //check first if its a picture
        $('.imagePreview').fadeIn();
        readURL($('#profile')[0]);
        console.log('change detacted!');
        $('.selectPic').text(pathName($('#profile').val()));
    });

    $('.upload').click(function (e) { 
        e.preventDefault();
        $('.uploadBtn').click();
        $('.upload').fadeOut();
    });

    $('#profilePic').submit(function (e) { 
        e.preventDefault();
        var url;
        if ($('.uploadBtn').val() === 'Upload picture')
            url = 'http://localhost:3000/profile/storePic';
        else
            url = 'http://localhost:3000/init/storePic';
        console.log($('#profilePic').serializeArray());
        
        // var formData = new FormData($('#profilePic')[0]);
        var data = new FormData(this);
        // jQuery.each(jQuery('#profilePic')[0].files, function(i, file) {
        //     data.append('file-'+i, file);
        // });
        storePic(data, url);
        console.log($('#profilePic'));
        console.log('send');
    });

    $('#logout').click(function (e) { 
        e.preventDefault();
        localStorage.removeItem('matchaToken');
        logout();
    });

    var from;

    $('.nextButton').click(function (e) { 
        e.preventDefault();
        from = $(this).attr('data-from');
        console.log($(this).attr('data-from'));
        animateCSS('.' + from, 'slideOutLeft', function() {
            // Do something after animation
            $('.' + from).hide();
            $('.aboutBody').show();
            animateCSS('.aboutBody', 'slideInRight');
        })
    });

    $('.validString').on('keypress', function(e) {
    var regex = /^[a-zA-Z]*$/;
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (checkFormat(str, regex, null)){
        return true;
    }
    e.preventDefault();
        return false;
    });

    $('.validEmail-register').change(function (e) { 
        e.preventDefault();
       checkFormat($('.validEmail-register').val(), /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, '.validEmail-register');
    });

    $('.validEmail-login').change(function (e) { 
        e.preventDefault();
       checkFormat($('.validEmail-login').val(), /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, '.validEmail-login');
    });

    $('.validPassword-register').change(function (e) { 
        e.preventDefault();
        checkFormat($('.validPassword-register').val(), /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, '.validPassword-register')
    });
    $('.validPassword-login').change(function (e) { 
        e.preventDefault();
        checkFormat($('.validPassword-login').val(), /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, '.validPassword-login')
    });
});

