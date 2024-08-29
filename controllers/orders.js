const ordersService = require('../services/orders');

const getMyOrders = async (req, res) => {
    const orders = await ordersService.getOrdersByUser(req.session.username);
    if (!orders) {
        return res.status(404).json({errors: ['Orders not found'] }); 
    }
    res.json(orders);
};


module.exports = { 
    getMyOrders
};