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
            url: `/manager/order-cancel/${id}`,
            type: 'DELETE',
            success: () => {
                $('#deleteModal').modal('hide');
                alert('Order has been cancelled');
                window.location.reload(true);
            },
            error: (xhr, status, error) => {
                alert('Error cancelling the order: ' + error);
            }
        });
    });
});

    // Deliver Order button click event
    $('.deliver-order-btn').click(function() {
        const orderId = $(this).data('id');

        // AJAX request to mark the order as delivered
        $.ajax({
            url: `/manager/order-deliver/${orderId}`,
            method: 'PATCH',
            success: function(response) {
                alert('Order has been marked as delivered');
                location.reload(); // Reload the page to reflect the change
            },
            error: function(error) {
                alert('Error marking the order as delivered');
            }
        });
    });

