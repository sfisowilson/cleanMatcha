
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
        // on successfull upload
        $('.nextButton').fadeIn();
    });

    $('#profilePic').submit(function (e) { 
        e.preventDefault();

        console.log($('#profilePic'));
        console.log('send');
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
      $('.imagePreview')
      
        .css('background-image', `${img}`);
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