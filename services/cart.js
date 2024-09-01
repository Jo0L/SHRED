const User = require('../models/user');

const getCart = async (username) => {
    try {
        // Find the user by their username
        const user = await User.findOne({ _id: username });

        if (!user) {
            console.log('User not found');
            return null; // Return null if the user doesn't exist
        }

        // Return the user's cart
        return user.cart || [];
    } catch (error) {
        console.error('Error fetching the cart:', error);
        throw error; // Throw the error so it can be handled by the caller
    }
};


const addToCart = async (username, accessoryId, price, quantity, title, img) => {
    try {
        const user = await User.findOne({ _id: username });
    
        if (!user) {
            console.log('User not found');
            return {"localUser": true}
        }

        // Check if the item is already in the cart
        const cartItem = user.cart.find(item => item.accessoryId.toString() === accessoryId);

        if (cartItem) {
            // If the item exists, increment the quantity
            cartItem.quantity += quantity;
        } else {
            // If the item doesn't exist, add a new item to the cart
            user.cart.push({
                accessoryId,
                quantity,
                price,
                title,
                img,
                addedAt: new Date(),
            });
        }

        await user.save();
        return user.cart;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
};

const adjustQuantity = async (username, accessoryId, action) => {
    try {
        const user = await User.findOne({ _id: username });
    
        if (!user) {
            console.log('User not found');
            return {"localUser": true}
        }

        // Check if the item is already in the cart
        const cartItem = user.cart.find(item => item.accessoryId.toString() === accessoryId);
        
        // If the item exists, adjust the quantity    
        if (cartItem) {

            if (action==='increment') {
                cartItem.quantity += 1;
            }
            else {
                if(cartItem.quantity > 1) {
                    cartItem.quantity -= 1;
                }
                else {
                    // Remove item if quantity reaches zero
                    user.cart = user.cart.filter(item => item.accessoryId.toString() !== accessoryId);
                }
            }
        } 

        await user.save();
        return user.cart;
    } catch (error) {
        console.error('Error adjusting item in cart:', error);
        throw error;
    }
};

const deleteItem = async (username, accessoryId) => {
    try {
        const user = await User.findOne({ _id: username });

        if (!user) {
            throw new Error('User not found');
        }
        console.log(user)
        // Filter out the item from the cart
        user.cart = user.cart.filter(item => item.accessoryId.toString() !== accessoryId);

        await user.save();
        return user.cart;
    } catch (error) {
        console.error('Error deleting item from cart:', error);
        throw error;
    }
};


const clearCart = async (username) => {
    try {
        const user = await User.findOne({ _id: username });

        if (!user) {
            throw new Error('User not found');
        }

        // Clear the cart
        user.cart = [];

        await user.save();
        return user.cart;
    } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
    }
};



module.exports = { 
    getCart, 
    addToCart,
    adjustQuantity,
    deleteItem,
    clearCart
};
