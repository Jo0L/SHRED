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
const updateAccessory = async (id, color, company, price, gender, img, stock) => {
    const accessory = await getAccessoryById(id);
    if (!accessory)
        return null;
    accessory.color = color;
    accessory.company = company;
    accessory.price = price;
    accessory.gender = gender;
    accessory.img = img;
    accessory.stock = stock;

    await accessory.save();
    return accessory;
};

const deleteAccessory = async (id) => {
    const accessory = await Accessory.findByIdAndDelete(id);
    return accessory;
};

const filterAndSortAccessories = async ({ type, gender, sortBy, search, color }) => {
    try {
        // Build query object
        let query = {};
        if (type !== 'all') query.type = type;
        if (gender) query.gender = gender;
        if (color) query.color = color;
        if (search) query.$or = [
            { type: new RegExp(search, 'i') },
            { company: new RegExp(search, 'i') }
        ];

        // Build sort options
        const sortOptions = {};
        if (sortBy === 'a-z') sortOptions.company = 1;
        if (sortBy === 'price-asc') sortOptions.price = 1; // Low to High
        if (sortBy === 'price-desc') sortOptions.price = -1; // High to Low

        return await Accessory.find(query).sort(sortOptions);
    } catch (err) {
        throw new Error('Failed to filter and sort accessories');
    }
};

const getDistinctColors = async () => {
    try {
        return await Accessory.distinct('color');
    } catch (err) {
        console.error('Error fetching distinct colors:', err);
        throw new Error('Failed to retrieve distinct colors');
    }
};




module.exports = {
    createAccessory, 
    getAccessoryById, 
    getAccessories, 
    updateAccessory, 
    deleteAccessory,
    filterAndSortAccessories,
    getDistinctColors
  };
