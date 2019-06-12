function signin(user)
    {
        // console.log('sending sign in request...');
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/users/signin",
            data: user,
            dataType: "JSON",
            success: function (response) {
                console.log(response);
                if (response.dataCount === 2 && response.data.status === 200)
                {
                    localStorage.setItem('matchaToken', response.data.token);

                    //reset the form
                    $('#loginForm')[0].reset();
                    $('.signinStatusButton').click();
                    $('.status').html('<h1>Signed in successfully!</h1><p>Redirecting to dashboard</p>');
                    //tell the user that a verification email was sent to them, use a modal for this
                    window.location.href = 'http://localhost:3000/dashboard';

                }
                else if (response.dataCount === 1 && response.data.status === 204)
                {
                    //reset the form
                    $('#loginForm')[0].reset();
                    $('.signinStatusButton').click();
                    $('.status').html('<h1>User NOT registered!</h1><p>No user with your email exist in our Database, please Register</p>');
                    //tell the user that a verification email was sent to them, use a modal for this

                }
                else if (response.dataCount === 1 && response.data.status === 208)
                {
                    //reset the form
                    $('#loginForm')[0].reset();
                    $('.signinStatusButton').click();
                    $('.status').html('<h1>Provided Password incorrect!</h1><p>password need to contain both uppercase and lowecase letters and atleast have a digit, with a minimum length of 6 characters!</p>');
                    //tell the user that a verification email was sent to them, use a modal for this

                }
                else if (response.dataCount === 1 && response.data.status === 216)
                {
                    //reset the form
                    $('#loginForm')[0].reset();
                    $('.signinStatusButton').click();
                    $('.status').html('<h1>Please verify your Account!</h1><p>an email with a verification link was sent to you!<br/><button class="btn btn-dark resend" data-email="'+ user.email +'">Resend the link</button></p>');
                    //tell the user that a verification email was sent to them, use a modal for this

                }
                else if (response.dataCount === 1 && response.data.status === 220)
                {
                    //reset the form
                    $('#loginForm')[0].reset();
                    $('.signinStatusButton').click();
                    $('.status').html('<h1>Your Account was Disabled!</h1><p>please contact to admin if you wish to reactivate it!</p>');
                    //tell the user that a verification email was sent to them, use a modal for this

                }
                else if (response.dataCount === 1 && response.data.status === 300)
                {
                    //reset the form
                    $('#loginForm')[0].reset();
                    $('.signinStatusButton').click();
                    $('.status').html('<h1>Network Problems!</h1><p>please make sure you are connected and try again!</p>');
                    //tell the user that a verification email was sent to them, use a modal for this

                }
                else if (response.dataCount === 2 && response.data.status === 212)
                {
                    //redirect to init
                    localStorage.setItem('matchaToken', response.data.token);
                    window.location.href = "http://localhost:3000/init";
                }
            }
        });
    }

    function register(user)
    {
        // console.log('sending register request...');
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/users/register",
            data: user,
            dataType: "JSON",
            success: function (response) {
                console.log(response);
                if (response.dataCount === 1 && response.data.status === 200)
                {
                    //reset the form
                    $('#registerForm')[0].reset();
                    $('.registerStatusButton').click();
                    $('.status').html('<h1>Registered successfully!</h1><p>A verification email was sent to your inbox, Please follow the link.</p><div class="btn btn-dark resend" data-email="'+ user.email +'">Re-send link</div>');
                    //tell the user that a verification email was sent to them, use a modal for this

                }
                if (response.dataCount === 1 && response.data.status === 204)
                {
                    //reset the form
                    $('#registerForm')[0].reset();
                    $('.registerStatusButton').click();
                    $('.status').html('<h1>User already registered!</h1><p>A user with your email already exist in our Database, please Sign in</p>');
                    //tell the user that a verification email was sent to them, use a modal for this

                }
                if (response.dataCount === 1 && response.data.status === 208)
                {
                    //reset the form
                    $('#registerForm')[0].reset();
                    $('.registerStatusButton').click();
                    $('.status').html('<h1>User already registered!</h1><p>please follow the link we sent you to activate your account</p><div class="btn btn-dark resend"  data-email="'+ user.email +'">Re-send link</div>');
                    //tell the user that a verification email was sent to them, use a modal for this

                }
                if (response.dataCount === 1 && response.data.status === 300)
                {
                    //reset the form
                    $('#registerForm')[0].reset();
                    $('.registerStatusButton').click();
                    $('.status').html('<h1>Network Problems!</h1><p>Please make sure you are connected and try again!</p>');
                    //tell the user that a verification email was sent to them, use a modal for this

                }
            }
        });
    }

    function resendVerification(email){
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/users/resendVerification",
            data: {email: email},
            dataType: "JSON",
            success: function (response) {
                console.log(response);
            }
        });
    }
    
    function renewPassword(user){
        console.log(user);
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/users/renewPassword",
            data: user,
            dataType: "JSON",
            success: function (response) {
                console.log(response);
                if (response.dataCount === 1 && response.data.status === 200)
                {
                    //reset the form
                    $('#renewPassword')[0].reset();
                    $('.registerStatusButton').click();
                    $('.status').html('<h1>Reset email sent successfully!</h1><p>A link was sent to you, follow it to reset your password!</p>');
                    //tell the user that a verification email was sent to them, use a modal for this
                }
                if (response.dataCount === 1 && response.data.status === 204)
                {
                    //reset the form
                    $('#renewPassword')[0].reset();
                    $('.registerStatusButton').click();
                    $('.status').html('<h1>Incorrect email provided!</h1><p>No user with that email is registered, please try again or register!</p>');
                    //tell the user that a verification email was sent to them, use a modal for this
                }
            }
        });
    }

    function reset(user){
        console.log('hello');
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/users/resetPassword",
            data: user,
            dataType: "JSON",
            success: function (response) {
                console.log(response);
                if (response.dataCount === 1 && response.data.status === 200)
                {
                    //reset the form
                    $('#renewPasswordForm')[0].reset();
                    $('.registerStatusButton').click();
                    $('.status').html(`<h1>Password reset successful!</h1><p>Redirecting to index, try signing in!</p>
                    <div class="loader"></div>`);
                    
                    window.setTimeout(function () {
                        location.href = "http://localhost:3000/";
                    }, 5000);

                }
                else if (response.dataCount === 1 && response.data.status === 208 || response.data.status === 204)
                {
                    //reset the form
                    $('#renewPasswordForm')[0].reset();
                    $('.registerStatusButton').click();
                    $('.status').html('<h1>Something went wrong!</h1><p>Failed to reset password!</p>');
                }
            }
        });
    }

    function saveAbout(user){
        console.log('hello save');
        $.ajax({
            type: "POST",
            beforeSend: function(xhr) {
				xhr.setRequestHeader('Authorization', 'Bearer '+ localStorage.getItem("matchaToken"));
			},
            url: "http://localhost:3000/init/saveAbout",
            data: user,
            dataType: "JSON",
            success: function (response) {
                console.log(response);
                if (response.dataCount === 1 && response.data.status === 200)
                {
                    window.location.href = 'http://localhost:3000/dashboard';
                    //Forbiden, delete token, redirect to login
                    //tell the user that a verification email was sent to them, use a modal for this
                }
                
            }
        });
    }
    var pic;

    function storePic(file, url){
        console.log('hello save');
        console.log(file);
        console.log('Bearer '+ localStorage.getItem("matchaToken"));
        $.ajax({
            type: "POST",
            beforeSend: function(xhr) {
				xhr.setRequestHeader('Authorization', 'Bearer '+ localStorage.getItem("matchaToken"));
			},
            url: url,
            data: file,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {

                if (response.dataCount === 1 && response.data.status === 403)
                {
                    localStorage.removeItem('matchaToken');
                    window.location.href = 'http://localhost:3000/';
                    //Forbiden, delete token, redirect to login
                    //tell the user that a verification email was sent to them, use a modal for this
                }
                 if (response.dataCount === 2 && response.data.status === 200)
                {
                    $('#pic').val(response.data.pic);
                    $('.nextButton').fadeIn();
                }
                if (url === 'http://localhost:3000/init/storePic')
                    refreshGallery();
            }
        });
    }

    function logout()
    {
        console.log("logging u out");
         $.ajax({
            type: "POST",
            url: "http://localhost:3000/users/logout",
            dataType: "JSON",
            success: function (response) {
                console.log(response);
            }
         });
    }

    function checkFormat(email, regex, selector){
    if (email.match(regex)){
        if (selector)
            $(selector).css('borderColor', 'green');
        return true;
    }
    if (selector)
        $(selector).css('borderColor', 'tomato');
    return false;
}

function pathName(path){
    var name = path.split('/');
    if (name.length === 1)
    {
        name = path.split('\\');
    }
    return name[name.length - 1];
}


function makeObject(arr)
{
    /*
    **  takes a form serialized array [{name: 'john', value: 'doe'}]
    **  returns {john : doe}
    */

    var obj = {};
    for (var i = 0; i < arr.length; i++)
    {
        obj[arr[i].name] = arr[i].value;
    }
    return obj;
}


function readURL(input) {
        // console.log(input);
        // console.log(input.files);
  if (input.files && input.files[0]) {
        // console.log('------>>');
    var reader = new FileReader();
    reader.onload = function (e) {
        // console.log('------');
        // console.log(e.target.result);
        var img = 'url(';
        img += e.target.result;
        img += ')';
      console.log(img);
      $('.imagePreview').css('background-image', `${img}`);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// animation management function, from animation.io

function animateCSS(element, animationName, callback) {
    const node = document.querySelector(element)
    node.classList.add('animated', animationName)

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}