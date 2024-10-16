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

// Add to wishlist
$(document).ready(function() {
    $('#add-to-wishlist').on('click', function(e) {
        e.preventDefault();

        const accessoryId = $(this).data('accessory-id');

        // Prepare data to send
        const wishlistData = {
            accessoryId,
        };
     
        $.ajax({
            url: '/wishlist/addOrRemove',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(wishlistData),
            success: function(response) {

                if (response.status==="Added") {
                    alert('Item added to Wishlist successfully!');  
                } else {
                    alert('Item was removed from Wishlist successfully!');
                }
                
                $('#add-to-wishlist').toggleClass('inwishlist'); 
            },
            error: function(err) {
                if (err.status === 401) {
                    alert('You must be logged in to add items to the Wishlist.');
                    window.location.href = '/login';
                } else {
                    alert('An error occurred while adding item to Wishlist.');
                    console.error(err);
                }
            }
        });
    });
});

// Check on load if the product is already in wishlist
$(document).ready(async function () {
    const accessoryId = $('#add-to-wishlist').data('accessory-id'); // Get accessory ID from the element's data attribute

    try {
        const response = await $.ajax({
            url: '/wishlist/isInWishlist',
            type: 'POST',
            data: {
                accessoryId: accessoryId
            }
        });

        // If the item is in the wishlist, add the 'inwishlist' class to show the gold star
        if (response.status) {
            $('#add-to-wishlist').addClass('inwishlist'); // Adds the gold star if in wishlist
        } else {
            $('#add-to-wishlist').removeClass('inwishlist'); // Ensures no gold star if not in wishlist
        }
    } catch (error) {
        console.error('Error checking wishlist status:', error);
    }
});

// Make sure the inputs are with positive value
document.getElementById('price-input').addEventListener('input', function() {
    if (this.value < 0) {
        this.value = 0;
    }
});

document.getElementById('stock-input').addEventListener('input', function() {
    if (this.value < 0) {
        this.value = 0;
    }
});