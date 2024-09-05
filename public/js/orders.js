$(document).ready(function() {
    // Cancel Order button click event
    $('.cancel-order-btn').click(function() {
        const orderId = $(this).data('id');

        // AJAX request to cancel the order
        $.ajax({
            url: `/manager/order-cancel/${orderId}`,
            method: 'DELETE',
            success: function(response) {
                alert('Order has been cancelled');
                location.reload(); // Reload the page to reflect the change
            },
            error: function(error) {
                alert('Error cancelling the order');
            }
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
});
