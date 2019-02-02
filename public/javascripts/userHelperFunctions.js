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
                    //reset the form
                    $('#loginForm')[0].reset();
                    $('.signinStatusButton').click();
                    $('.status').html('<h1>Signed in successfully!</h1><p>Redirecting to dashboard</p>');
                    //tell the user that a verification email was sent to them, use a modal for this

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
                    $('.status').html('<h1>Please verify your Account!</h1><p>an email with a verification link was sent to you!</p>');
                    //tell the user that a verification email was sent to them, use a modal for this

                }
                else if (response.dataCount === 1 && response.data.status === 212)
                {
                    //redirect to init
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
                    $('.status').html('<h1>Registered successfully!</h1><p>A verification email was sent to your inbox, Please follow the link.</p>');
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
            }
        });
    }