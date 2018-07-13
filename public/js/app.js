$(document).ready(() => {

    $(document).on('click', '#scrapebtn', event => {
        event.preventDefault();
        $.get('/scrape', data => {}).then(result => {
            if (result) {
                window.location.href = '/';
            }
        })
    });


    var modal = $('#myModal');

    $('.note').on('click', function (event) {
        event.preventDefault();
        var id = $(this).attr('id');
        $('#insert-title').val('');
        $('#insert-body').val('');

        
        $.get(`/note/${id}`).then(function (data) {

            if (data) {
                console.log(data);
                $('#insert-title').val(data.title);
                $('#insert-body').val(data.body);
            }
            modal.css({
                'display': 'block'
            });
            $('.submit-note').on('click', function(event) {
                event.preventDefault();
                // var id = $(this).attr('id');
                $.ajax({
                    method: 'POST',
                    url: `/note/${id}`,
                    data: {
                        title: $('#insert-title').val(),
                        body: $('#insert-body').val()
                    }
                }).then(function (data) {
                    modal.css({
                        'display': 'none'
                    });
                })
            });
        });
       
    });

    $('.close').on('click', event => {
        event.preventDefault();
        modal.css({
            'display': 'none'
        });
    })






    //not functional - make sure to come back and fix
    $('.save').on('click', function (event) {
        event.preventDefault();
        var id = $(this).attr('id');

        $.post(`/api/savedarticles/${id}`, data => {

        }).then(results => {
            if (results) {
                return alert('Article was saved.');

            }

        })
    });



    $('.delete').on('click', function (event) {
        var id = $(this).attr('id');
        $.ajax({
            method: 'DELETE',
            url: `/api/savedarticles/${id}`
        }).then(result => {
            if (result) {
                window.location.href = '/savedarticles';
            }
        })
    })






})