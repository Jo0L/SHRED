const cartService = require('../services/cart'); // Adjust the path as needed

const getPaymentDetails = async (req, res) => {
    const username = req.session.username;
    const isAdmin = req.session.isAdmin || false; // Check if the user is an admin

    if (!username) {
        res.status(401).json({ success: false, message: 'No user is authenticated', localUser: true });
        return;
    }

    try {
        const cart = await cartService.getCart(username);

        if (cart) {
            let subtotal = 0;
            cart.forEach(item => {
                subtotal += item.price * item.quantity; // Calculate subtotal
            });

            const shipping = 3.99; // Fixed shipping cost
            const taxRate = 0.17; // Tax rate (17%)
            const tax = (subtotal * taxRate).toFixed(2); // Calculate tax
            const total = (subtotal + shipping + parseFloat(tax)).toFixed(2); // Calculate total including tax and shipping

            // Render the payment page with necessary variables
            res.status(200).render('payment', { 
                cart, 
                username, 
                isAdmin, 
                subtotal: subtotal.toFixed(2), // Format subtotal to 2 decimal places
                shipping: shipping.toFixed(2), 
                tax, 
                total 
            });
        } else {
            res.status(401).json({ success: false, message: 'Something went wrong - user doesn\'t exist' });
        }
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
};

// Handle payment confirmation
const confirmPayment = async (req, res) => {
    const username = req.session.username;
    
    if (!username) {
        return res.status(401).json({ success: false, message: 'No user is authenticated', localUser: true });
    }

    // Here you would process the payment.
    // For this example, we assume the payment is successful.

    // Redirect to the payment-success page
    res.redirect('/payment-success');
};

// Export the controller functions
module.exports = {
    getPaymentDetails,
    confirmPayment // Add the confirmPayment function to exports
};
