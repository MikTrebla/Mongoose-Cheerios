$(document).ready(() => {

    $.get('/', data => {}).then(result => {
        console.log('stuff');
    })

    $('#scrape-website').on('click', function (event) {
        event.preventDefault();
        $.get('/scrape', data => {}).then(result => {
            // console.log(result);
            console.log('reload dammit')

            window.location.reload();
        })
    })



    $(document).on('click', '.comment', function (event) {
        // console.log('clicked')
        event.preventDefault();
        var id = $(this).attr('id');
        console.log(id);
        $.get('/article/' + id, data => {

        }).then(result => {
            console.log(result);
            // window.location.href = '/';
        })
    })


})