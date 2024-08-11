const Watch = require('../models/watch');

const createWatch = async (type, color, company, price, gender, img, stock) => {
    const watch = new Watch({
        type, //Digital clock or dials
        color, 
        company, 
        price, 
        gender,//for women or men
        img, 
        stock 
    })
    await watch.save();
};

const getWatchById = async (id) => {
    return await Watch.findById(id);
};

const getWatches = async () => {
    return await Watch.find();
};

// we need to think what we want to update - maybe only price? maybe 2 diffrent functions?
const updateWatch = async (id, price, stock) => {
    const watch = await getWatchById(id);
    if (!watch)
        return null;
    watch.price = price;
    watch.stock = stock;
    await watch.save();
    return watch;
};

const deleteWatch = async (id) => {
    const watch = await getWatchById(id);
    if (!watch)
        return null;
    await watch.remove();
    return watch;
};

module.exports = {
    createWatch, 
    getWatchById, 
    getWatches, 
    updateWatch, 
    deleteWatch
  };
