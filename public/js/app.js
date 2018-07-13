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
        modal.css({
            'display': 'block'
        });
        $.get(`/note/${id}`).then(function (data) {
            if (data) {
                $('#insert-title').val(data.title);
                $('#insert-body').val(data.body);
            }
        });

    });

    $('.submit-note').on('click', event => {
        event.preventDefault();
        var id = $('.submit-note').attr('id');
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
            alert('Article was saved.');
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