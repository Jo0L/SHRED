const wishlistService = require('../services/wishlist');

const addOrRemoveItem = async (req, res) => {
    const username = req.session.username;
    const { accessoryId } = req.body;
    
    if (!username) {
        res.status(401).json({ success: false, message: 'Add locally no user is authonticated', localUser: true });
        return;
    }
    
    try {
        const result = await wishlistService.addOrRemoveItem(username, accessoryId);
        
        if (result=="Added") {
            res.status(200).json({ status: "Added", message: 'Item added to wishlist successfully' });
        }
        else {
            res.status(200).json({ status: "Removed", message: 'Item was removed from wishlist successfully' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to add/remove item from wishlist' });
    }

}

const isInWishlist = async (req, res) => {
    const username = req.session.username;
    const { accessoryId } = req.body;
    
    if (!username) {
        res.status(401).json({ success: false, message: 'Add locally no user is authonticated', localUser: true });
        return;
    }
    
    try {
        const result = await wishlistService.isInWishlist(username, accessoryId);
        
        if (result) {
            res.status(200).json({ status: true, message: 'Item is in wishlist' });
        }
        else {
            res.status(200).json({ status: false, message: 'Item is not in wishlist' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to update accessory' });
    }

}

const getWishlist = async (req, res) => {
    const username = req.session.username;
    
    if (!username) {
        res.status(401).json({ success: false, message: 'Add locally no user is authonticated', localUser: true });
        return;
    }
    
    try {
        const wishlistData = await wishlistService.getWishlist(username);
        
        if (wishlistData) {
            res.status(200).json({ success: true, wishlistData: wishlistData });
        }
        else {
            res.status(500).json({ success: false, message: 'Error while accessing wishlist' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }

}

module.exports = { 
    addOrRemoveItem,
    isInWishlist,
    getWishlist
};