
$(document).ready(function(){
    $('#register').submit(function (e) { 
        e.preventDefault();
        const user = makeObject($('#register').serializeArray());
        console.log(user);
    });

    $('#login').submit(function (e) { 
        e.preventDefault();
        const user = makeObject($('#login').serializeArray());
        console.log(user);
    });

    $('.selectPic').click(function(e){
        e.preventDefault();
        $('#profile').click();
    })
    $('#profile').change(function (e) { 
        e.preventDefault();
        console.log('change detacted!');
        $('.selectPic').text(pathName($('#profile').val()));
    });

    $('.upload').click(function (e) { 
        e.preventDefault();
        $('.uploadBtn').click();
    });

    $('#profilePic').submit(function (e) { 
        e.preventDefault();

        console.log($('#profilePic'));
        console.log('send');
    });
});

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