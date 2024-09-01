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

// Add to cart
$(document).ready(function() {
    $('#add-to-cart').on('click', function(e) {
        e.preventDefault();

        const accessoryId = $(this).data('accessory-id');
        const quantity = $(this).data('quantity');
        const price = $(this).data('price');
        const title = $(this).data('title');
        const img = $(this).data('img');

        // Prepare data to send
        const cartData = {
            accessoryId,
            quantity,
            price,
            title,
            img
        };
     
        $.ajax({
            url: '/cart/add',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(cartData),
            success: function(response) {

                if (response.success) {
                    alert('Item added to cart successfully!');
                } else {
                    alert('Failed to add item to cart: ' + response.message);
                }
            },
            error: function(err) {
                if (err.status === 401) {
                    alert('You must be logged in to add items to the cart.');
                    window.location.href = '/login';
                } else {
                    alert('An error occurred while adding item to cart.');
                    console.error(err);
                }
            }
        });
    });
});