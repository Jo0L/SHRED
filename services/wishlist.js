const User = require('../models/user');
const Accessory = require('../models/accessories');

const addOrRemoveItem = async (username, accessoryId) => {
    try {
        const user = await User.findOne({ _id: username });
    
        if (!user) {
            console.log('User not found');
            return {"localUser": true};
        }

        // Find the index of the item in the wishlist
        const wishlistItemIndex = user.whishlist.findIndex(item => item.accessoryId.toString() === accessoryId);

        if (wishlistItemIndex === -1) {
            // If the item doesn't exist in the wishlist, add it
            user.whishlist.push({
                accessoryId,
            });

            await user.save();
            return "Added";

        } else {
            // If the item exists in the wishlist, remove it
            user.whishlist.splice(wishlistItemIndex, 1);

            await user.save();
            return "Removed";
        }

    } catch (error) {
        console.error('Error modifying wishlist:', error);
        throw error;
    }
};

const isInWishlist = async (username, accessoryId) => {
    try {
        const user = await User.findOne({ _id: username });
    
        if (!user) {
            console.log('User not found');
            return {"localUser": true}
        }

        // Find the index of the item in the wishlist
        const wishlistItemIndex = user.whishlist.findIndex(item => item.accessoryId.toString() === accessoryId);

        // If the item exists in the wishlist return true otherwise return false.
        if (wishlistItemIndex === -1) {
            return false;
        } 
        else {
            return true;
        }

    } catch (error) {
        console.error('Error accessing wishlist:', error);
        throw error;
    }
}

const getWishlist = async (username) => {
    try {
        const user = await User.findOne({ _id: username });
    
        if (!user) {
            console.log('User not found');
            return {"localUser": true}
        }

        // Get wishlist
        const wishlist = user.whishlist;
    
        // Create a new array to store the accessory data
        const wishlistData = [];

        // Loop through each item in the wishlist and fetch accessory details
        for (const item of wishlist) {
            const accessory = await Accessory.findById(item.accessoryId); // Fetch the accessory details by ID
            
            if (accessory) {
                wishlistData.push({
                    id: accessory._id,
                    type: accessory.type,
                    price: accessory.price,
                    img: accessory.img,
                    company: accessory.company,
                    color: accessory.color,
                    gender: accessory.gender, 
                });
            }
        }

        if (wishlistData) {
            return wishlistData;
        } 
        else {
            return [];
        }

    } catch (error) {
        console.error('Error accessing wishlist:', error);
        throw error;
    }
}

module.exports = { 
    addOrRemoveItem,
    isInWishlist,
    getWishlist
};