$(document).ready(() => {

    $('#scrapebtn').on('click', event => {
        event.preventDefault();
        $.get('/scrape', data => {}).then(result => {
            window.location.reload();
        })
    });


    var modal = $('#myModal');

    $('.note').on('click', function (event) {
        id = $(this).attr('id');
        console.log(id);
        event.preventDefault();
        modal.css({
            'display': 'block'
        });
        $('#submit-note').on('click', event => {
            event.preventDefault();
            var noteObj = {
                title: $('#insert-title').val().trim(),
                body: $('#insert-body').val().trim()
            }
            $.ajax({
                method: 'POST',
                url: '/note/' + id,
                data: {
                    title: $('#insert-title').val().trim(),
                    body: $('#insert-body').val().trim()
                }
            }).then(function (data) {
                console.log(data);
                modal.css({
                    'display': 'none'
                });
                $('#insert-title').val('');
                $('#insert-body').val('');
                // alert('note added');
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