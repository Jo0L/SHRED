const Order = require('../models/order');

const createOrder = async (user, items, price, amount, paymentData, status) => {

    try {
        const order = new Order({
            user,
            date: new Date(),
            price,
            amount,
            items,
            paymentData,
            status,
        })
        await order.save();

        return true;
    }
    catch (error) {
        console.error('Error adding to cart:', error);
        return false;
    }
};

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
    updateOrderStatus,
    createOrder
};
