// Cart functions
$(document).ready(function() {

    // Inc quantity for specific item
    $(document).on('click', '.inc-quantity', function(e) {
        e.preventDefault();

        const accessoryId = $(this).data('accessory-id');

        const data = {
            action: 'increment',
            accessoryId: accessoryId
        }

        adjustQuantity(data);
    });

    
    // Dec quantity for specific item
    $(document).on('click', '.dec-quantity', function(e) {
        e.preventDefault();

        const accessoryId = $(this).data('accessory-id');

        const data = {
            action: 'decrement',
            accessoryId: accessoryId
        }

        adjustQuantity(data);
    });

    
    // Delete item
    $(document).on('click', '.delete-btn', function(e) {
        e.preventDefault();

        const accessoryId = $(this).data('accessory-id');

        const data = {
            accessoryId: accessoryId
        }

        deleteItem(data);
    });
});


function adjustQuantity(data) {
    $.ajax({
        url: '/cart/adjustQuantity',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            if (response.success) {
                // alert('Item was ' + data.action + 'ed successfully');
        
                // Update visually
                if (response.quantity) {
                    $(`#quantity-${data.accessoryId}`).text(response.quantity);
                }
          
            } else {
                console.log('Failed to adjut item in cart: ' + response.message);
            }
        },
        error: function(err) {
            if (err.status === 401) {
                alert('You must be logged in to adjust items in the cart.');
                window.location.href = '/login';
            } else {
                alert('An error occurred while adjusting item in cart.');
                console.error(err);
            }
        }
    });
}

function deleteItem(data) {
    $.ajax({
        url: '/cart/removeItem',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            if (response.success) {
                // Update visually
                $(`#${data.accessoryId}`).remove();
            } else {
                console.log('Failed to delete item from cart: ' + response.message);
            }
        },
        error: function(err) {
            if (err.status === 401) {
                alert('You must be logged in to delete items from the cart.');
                window.location.href = '/login';
            } else {
                alert('An error occurred while deleting item from cart.');
                console.error(err);
            }
        }
    });
}