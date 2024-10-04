const cartService = require('../services/cart');

const getCart = async (req, res) => {
    const username = req.session.username;

    if (!username) {
        res.status(401).json({ success: false, message: 'No user is authonticated', localUser: true });
        return;
    }

    try {
        const cart = await cartService.getCart(username);

        if (cart) {
            // Calculate totals
            let subtotal = 0;
            cart.forEach(item => {
                subtotal += item.price * item.quantity;
            });

            const shipping = 3.99;
            const tax = "17%";
            const taxRate = 0.17;
            const total = (subtotal + shipping) * (1 + taxRate);

            res.status(200).render('cart', { cart, username: req.session.username, isAdmin: req.session.isAdmin, subtotal, shipping, tax, total });
        }
        else {
            res.status(401).json({ success: false, message: 'Something went wrong - user doesnt exists' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
};

const addToCart = async (req, res) => {

    const username = req.session.username;
    const { accessoryId, price, quantity, title, img } = req.body;
    
    if (!username) {
        res.status(401).json({ success: false, message: 'Add locally no user is authonticated', localUser: true });
        return;
    }
    
    try {
        const result = await cartService.addToCart(username, accessoryId, price, quantity, title, img);
        
        if (result) {
            res.status(200).json({ success: true, message: 'Item added to cart successfully' });
        }
        else {
            res.status(500).json({ success: false, message: 'Item wasn\'t added to cart' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to update accessory' });
    }
};

const adjustQuantity = async (req, res) => {
    const username = req.session.username;
    const { accessoryId, action } = req.body;
    
    if (!username) {
        res.status(401).json({ success: false, message: 'Forbidden', localUser: true });
        return;
    }
    
    try {
        const cart = await cartService.adjustQuantity(username, accessoryId, action);
        
        if (cart) {
            const accessory = cart.find(item => item.accessoryId === accessoryId);
    
            res.status(200).json({ success: true, message: 'Item quantity was adjusted successfully', quantity: accessory.quantity });
        }
        else {
            res.status(500).json({ success: false, message: 'Item wasn\'t adjusted' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to update item in cart' });
    }
};

const deleteItem = async (req, res) => {
    const username = req.session.username;
    const { accessoryId } = req.body;
    
    if (!username) {
        res.status(401).json({ success: false, message: 'Forbidden', localUser: true });
        return;
    }
    try {
        const cart = await cartService.deleteItem(username, accessoryId);

        if (cart) {
            res.status(200).json({ success: true, message: 'Item was deleted successfully' });
        }
        else {
            res.status(500).json({ success: false, message: 'Item wasn\'t deleted' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to deleted item from cart' });
    }
};

const clearCart = async (req, res) => {

};


module.exports = { 
    getCart, 
    addToCart,
    adjustQuantity,
    deleteItem,
    clearCart
};