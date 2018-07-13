$(document).ready(() => {

    $(document).on('click', '#scrapebtn', event => {
        event.preventDefault();
        $.get('/scrape', data => {}).then(result => {
            if (result) {
                window.location.reload();
            }
        })
    });


    var modal = $('#myModal');

    $('.note').on('click', function (event) {
        event.preventDefault();
        id = $(this).attr('id');
        $('#insert-title').val('');
        $('#insert-body').val('');
        modal.css({
            'display': 'block'
        });
        $.get('/note/' + id).then(function (data) {
            if (data) {
                $('#insert-title').val(data.title);
                $('#insert-body').val(data.body);
            }
        });
        $('#submit-note').on('click', event => {
            event.preventDefault();
            $.ajax({
                method: 'POST',
                url: '/note/' + id,
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
        console.log(id);

        $.post('/api/savedarticles/' + id, data => {

        }).then(results => {
            alert('Article was saved.');
        })
    });










})