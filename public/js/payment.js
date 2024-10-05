$(document).ready(function() {
    $('#confirmPaymentBtn').click(function(e) {
        e.preventDefault(); // Prevent the default form submission

        // Collect payment form data
        const paymentData = {
            cardNumber: $('#cardNumber').val(),
            cardHolder: $('#cardHolder').val(),
            expiryDate: $('#expiryDate').val(),
            cvv: $('#cvv').val(),
            billingAddress: $('#billingAddress').val(),
        };

        // Send the POST request to the /orders/createorder route
        $.ajax({
            url: '/orders/createorder',
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
