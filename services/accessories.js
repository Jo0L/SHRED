const Accessory = require('../models/accessories');
const User = require('../models/user'); // Import User model

const createAccessory = async (type, color, company, price, gender, img, stock) => {
    try {
        const accessory = new Accessory({
            type, 
            color,
            company,
            gender,
            price,
            stock,
            img
        });

        await accessory.save();
        console.log('Accessory created successfully');
        return accessory;

    } catch (error) {
        console.error('Error creating accessory:', error.message);
        throw new Error('Failed to create accessory. Please try again.');
    }
};

const getAccessoryById = async (id) => {
    return await Accessory.findById(id);
};

const getAccessories = async (accessoryType) => {
    const type = accessoryType.toLowerCase();
    if (accessoryType === 'accessories') {
        return await Accessory.find();
    } else {
        return await Accessory.find({ type });
    }
};

const updateAccessory = async (id, color, company, price, gender, img, stock) => {
    const accessory = await getAccessoryById(id);
    if (!accessory) return null;
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
    // Step 1: Delete the accessory
    const accessory = await Accessory.findByIdAndDelete(id);
    if (!accessory) return null;

    // Step 2: Remove the accessory from all user carts
    await User.updateMany(
        { 'cart.accessoryId': id },
        { $pull: { cart: { accessoryId: id } } }
    );

    return accessory;
};

const filterAndSortAccessories = async ({ type, gender, sortBy, search, color, page, limit }) => {
    try {
        let query = {};
        if (type !== 'accessories') query.type = type;
        if (gender) query.gender = gender;
        if (color) query.color = color;
        if (search) query.$or = [
            { type: new RegExp(search, 'i') },
            { company: new RegExp(search, 'i') }
        ];

        const sortOptions = {};
        if (sortBy === 'a-z') sortOptions.company = 1;
        if (sortBy === 'price-asc') sortOptions.price = 1;
        if (sortBy === 'price-desc') sortOptions.price = -1;

        const skip = (page - 1) * limit;
        return await Accessory.find(query).collation({ locale: 'en', strength: 2 }).sort(sortOptions).skip(skip).limit(limit);
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

const getAccessoryCount = async ({ type, gender, search, color }) => {
    try {
        let query = {};
        if (type !== 'accessories') query.type = type;
        if (gender) query.gender = gender;
        if (color) query.color = color;
        if (search) query.$or = [
            { type: new RegExp(search, 'i') },
            { company: new RegExp(search, 'i') }
        ];

        return await Accessory.countDocuments(query);
    } catch (err) {
        throw new Error('Failed to count accessories');
    }
};

module.exports = {
    createAccessory, 
    getAccessoryById, 
    getAccessories, 
    updateAccessory, 
    deleteAccessory,
    filterAndSortAccessories,
    getDistinctColors,
    getAccessoryCount
};
