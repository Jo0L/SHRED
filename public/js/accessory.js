// Edit an item
$('#edit-button').click(() => { 
    $('#error-message').hide().text('');
    
    $.ajax({
        url: '/accessories/update-accessory',
        type: 'PATCH',
        data: $('#edit-form').serialize(),
        success: (res) => {
            $('#modal').modal('hide');
            alert('Item edited successfully!');
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
            url: `/accessories/delete/${id}`,
            type: 'DELETE',
            success: () => {
                $('#deleteModal').modal('hide');
                alert('item deleted succesfully!');
                window.location.href = '/accessories'; 
            },
            error: (xhr, status, error) => {
                alert('An error occurred while deleting the item: ' + error);
            }
        });
    });
});