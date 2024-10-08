// Check if there are any items in cart
$(document).ready(function() {
    // Get the subtotal element
    const subtotalElement = document.getElementById('subtotal');
    
    // Check if the element exists
    if (subtotalElement) {
        // Extract the subtotal value and convert it to a float
        const subtotalValue = parseFloat(subtotalElement.textContent.replace('$', ''));
        
        // If the subtotal is 0, redirect to the cart page
        if (subtotalValue === 0) {
            window.location.href = '/cart';
        }
    } else {
        console.error('Subtotal element not found');
    }
});

$(document).ready(function() {
    $('#confirmPaymentBtn').click(function(e) {
        const form = document.querySelector('form'); // Get the form element
        
        // Check if the form is valid
        if (form.checkValidity() === false) {
            // If the form is invalid, allow the browser to handle the validation (shows error messages)
            form.reportValidity(); // This will trigger validation and display error messages
            return; // Stop here, do not proceed with the AJAX request
        }

        e.preventDefault(); // Prevent the default form submission

        // Collect payment form data
        const paymentData = {
            cardNumber: $('#cardNumber').val(),
            cardHolder: $('#cardHolder').val(),
            expiryDate: $('#expiryDate').val(),
            cvv: $('#cvv').val(),
            billingAddress: $('#billingAddress').val(),
        };

        // Send the POST request to the /orders route
        $.ajax({
            url: '/orders',
            type: 'POST',
            data: paymentData, // Data to send
            success: function(response) {
                // Handle success and redirect to the payment success page
                console.log('Order created successfully:', response);
                window.location.href = '/payment-success'; // Redirect to payment success page
            },
            error: function(xhr, status, error) {
                // Handle error (e.g., show error message)
                console.error('Error creating order:', error);
                alert('An error occurred while processing your payment. Please try again.');
            }
        });
    });
});