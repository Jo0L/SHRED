const Order = require('../models/order');

const getOrdersByUser = async (user) => {
    return await Order.find({user});
};

module.exports = { getOrdersByUser };
