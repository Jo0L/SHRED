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
        
        let itemQuantity = parseInt($(`#quantity-${accessoryId}`).text()); 
        
        // If the quantity is 1 and decrement occured just delete the item
        if(itemQuantity>1) {
            adjustQuantity(data);
        }
        else {
            deleteItem(data);
        }
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
                    // Update amount of items
                    $(`#quantity-${data.accessoryId}`).text(response.quantity);

                    // Update price for quantity
                    let itemPrice = parseInt($(`#item_price-${data.accessoryId}`).text().replace('$', ''));
                    $(`#calculate_price-${data.accessoryId}`).text("$" + (itemPrice * response.quantity));

                    // Update cart amount
                    let itemAmount = parseInt($(`#item_amount`).text()); 
                    if(data.action == "increment") {
                        $(`#item_amount`).text(itemAmount + 1); 
                    }
                    else {
                        $(`#item_amount`).text(itemAmount - 1); 
                    }

                    // Update summary prices
                    const summaryData = {
                        action: data.action,
                        price: itemPrice
                    }

                    updateSummaryPrices(summaryData);

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
                $(`#quantity-${data.accessoryId}`).text(response.quantity);

                // Update title amount: X items.
                let itemAmount = parseInt($(`#item_amount`).text()); 
                let deletedItemAmount = parseInt($(`#quantity-${data.accessoryId}`).text()); 
                $(`#item_amount`).text(itemAmount - deletedItemAmount); 

                // Update summary prices
                const summaryData = {
                    action: "decrement",
                    price: parseInt($(`#calculate_price-${data.accessoryId}`).text().replace('$', ''))
                }
                updateSummaryPrices(summaryData);

                // Remove visually the itme
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

function updateSummaryPrices(data) {

    let subtotal=0, total=0;

    if(data.action == "increment") {
        subtotal = parseInt($(`#subtotal`).text().replace('$', '')) + data.price;
    }
    else {
        subtotal = parseInt($(`#subtotal`).text().replace('$', '')) - data.price;
    }
  
    const shipping = 3.99;
    const taxRate = 0.17;
    
    // If the amount of the items is 0 restart the summary. 
    if(subtotal>0) {
        total = (subtotal + shipping) * (1 + taxRate);
    }
    else {
        $(`#shipping`).text("$0");
        $(`#tax`).text("$0");
        total=0;
    }

    // Update the summary
    $(`#subtotal`).text("$" + (subtotal.toFixed(2)));
    $(`#total`).text("$" + (total.toFixed(2)));
}