$('#edit-button').click(() => { 
    $('#error-message').hide().text('');
    
    $.ajax({
        url: '/accessories',
        type: 'PATCH',
        data: $('#edit-form').serialize(),
        success: (res) => {
            $('#modal').modal('hide');
            window.location.reload(true);
        },
        error: function(xhr, status, error) {
            $('#error-message').text('An error occurred: ' + error).show();
        }
    });
});