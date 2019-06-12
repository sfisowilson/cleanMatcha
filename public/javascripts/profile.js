$(document).ready(function () {
    $(document).on('click', ".refreshGallery", function(){
        $('.gallery').html(`<div class='loader'></div>`);
        refreshGallery();
    });
    
    $(document).on('click', ".deleteImage", function(){
        // $('.gallery').html(`<div class='loader'></div>`);
        deleteImage();
    });
});

function deleteImage(){
    console.log('delete');
    $.ajax({
        type: "POST",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ localStorage.getItem("matchaToken"));
        },
        url: "http://localhost:3000/profile/deleteImage",
        dataType: "JSON",
        success: function (response) {
        }
    });
}

function refreshGallery(){
    console.log('hello save');
    $.ajax({
        type: "POST",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ localStorage.getItem("matchaToken"));
        },
        url: "http://localhost:3000/profile/refreshGallery",
        dataType: "JSON",
        success: function (response) {
            console.log(response);
            if (response.dataCount === 3 && response.data.status === 200)
            {
                //rebuild gallery
                var gallery = `<div class="row">`;
                var pics = ``;
                    for (var i = 0; i < response.data.pics.length; i++)
                    {
                        pics += `<div class="col-6 picThumb" style="background:url(${response.data.pics[i].imageName})">
                                    <div class="row picOptions">`;
                            if (response.data.userDetailes.pic === response.data.pics[i].imageName) { 
                                pics += `<div class="col-12 text-center bg-light text-dark refreshGallery">Profile</div>`;
                            } else {
                                pics += `<div class="col-6 text-center bg-light"><i class="fa fa-user-circle"></i></div>
                                        <div class="col-6 text-center bg-light"><i class="fa fa-trash-alt"></i></div>`;
                            }
                            pics += `</div>
                                </div>`;
                    }
                    gallery += pics;
                    gallery += `</div>`;
                    $('.gallery').html(gallery);
            }
            
        }
    });
}