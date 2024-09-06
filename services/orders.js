const Order = require('../models/order');
//const { find } = require('../models/user');

const getOrdersByUser = async (user) => {
    return await Order.find({user});
};

const getAllOrders = async () => {
    return await Order.find()
};

const cancelOrder = async (id) => {
    const order = await Order.findByIdAndDelete(id);
    return order;
};

const updateOrderStatus = async (id) => {
    const order = await Order.findById(id);
    if (!order)
        return null;
    order.status = 'Delivered';
    await order.save();
    return order;
};


module.exports = { 
    getOrdersByUser, 
    getAllOrders,
    cancelOrder,
    updateOrderStatus
};
