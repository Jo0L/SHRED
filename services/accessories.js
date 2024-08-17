const Accessory = require('../models/accessories');

const createAccessory = async ({ type, color, company, price, gender, img, stock }) => {
    const accessory = new Accessory({
        type, // watches / jewlery / sunglasses
        color,
        company,
        price,
        gender, //for female or male
        img,
        stock
    });
    await accessory.save();
    return accessory;  // Return the saved accessory
};

const getAccessoryById = async (id) => {
    return await Accessory.findById(id);
};

const getAccessories = async (accessoryType) => {
    
    const type = accessoryType.toLowerCase();
 
    if (accessoryType === 'all') {
        // Return all accessories if type is 'all'
        return await Accessory.find();
    } else {
        // Return accessories of the specified type
        return await Accessory.find({ type });
    }
};

// we need to think what we want to update - maybe only price? maybe 2 diffrent functions?
const updateAccessory = async (id, price, stock) => {
    const accessory = await getAccessoryById(id);
    if (!accessory)
        return null;
    accessory.price = price;
    accessory.stock = stock;
    await accessory.save();
    return accessory;
};

const deleteAccessory = async (id) => {
    const accessory = await getAccessoryById(id);
    if (!accessory)
        return null;
    await accessory.remove();
    return accessory;
};

module.exports = {
    createAccessory, 
    getAccessoryById, 
    getAccessories, 
    updateAccessory, 
    deleteAccessory
  };
