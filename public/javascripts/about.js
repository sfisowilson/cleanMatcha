$(document).ready(function () {
    $('#aboutForm').submit(function (e) { 
        e.preventDefault();
        const user = makeObject($('#aboutForm').serializeArray());
        saveAbout(user);

        console.log(user);
    });
});