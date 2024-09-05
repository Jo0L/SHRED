$(document).ready(function() {
    // Change Admin button click event
    $('.change-admin-btn').click(function() {
        const userId = $(this).data('id');
        const isAdmin = $(this).data('admin');

        // Toggle the isAdmin value
        const newAdminStatus = !isAdmin;

        // AJAX request to update the user's admin status
        $.ajax({
            url: `/manager/users/updateAdmin/${userId}`,
            method: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify({ isAdmin: newAdminStatus }),
            success: function(response) {
                location.reload(); // Reload the page to reflect the change
            },
            error: function(error) {
                alert('Error changing user admin status');
            }
        });
    });
});

// Delete am item
$(document).ready(() => {
    // When the delete modal is shown
    $('#deleteModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget); 
        const id = button.data('id'); 
        $('#confirm-delete-button').data('id', id); // Store the ID in the delete button
    });

    // When the delete button inside the modal is clicked
    $('#confirm-delete-button').click(function() { 
        const id = $(this).data('id'); 
        $.ajax({
            url: `/manager/user-delete/${id}`,
            type: 'DELETE',
            success: () => {
                $('#deleteModal').modal('hide');
                alert('item deleted succesfully!');
                window.location.reload(true);
            },
            error: (xhr, status, error) => {
                alert('An error occurred while deleting the user: ' + error);
            }
        });
    });
});