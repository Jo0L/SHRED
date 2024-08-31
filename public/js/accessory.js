$('#edit-button').click(() => { 
    $('#error-message').hide().text('');
    
    $.ajax({
        url: '/accessories/update-accessory',
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

$(document).ready(() => {
    // When the delete modal is shown
    $('#deleteModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget); // Button that triggered the modal
        const id = button.data('id'); // Extract the ID from data-* attribute
        $('#confirm-delete-button').data('id', id); // Store the ID in the delete button
    });

    // When the delete button inside the modal is clicked
    $('#confirm-delete-button').click(function() { // Use function() instead of arrow function
        const id = $(this).data('id'); // Access the data-id stored earlier
        $.ajax({
            url: `/accessories/delete/${id}`,
            type: 'DELETE',
            success: () => {
                $('#deleteModal').modal('hide');
                alert('item deleted succesfully!');
                window.location.href = '/accessories'; // Redirect to accessories list after deletion
            },
            error: (xhr, status, error) => {
                // Handle error
                alert('An error occurred while deleting the item: ' + error);
            }
        });
    });
});
