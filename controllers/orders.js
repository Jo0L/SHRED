const ordersService = require('../services/orders');

const getMyOrders = async (req, res) => {
    const orders = await ordersService.getOrdersByUser(req.session.username);
    if (!orders) {
        return res.status(404).json({errors: ['Orders not found'] }); 
    }
    res.json(orders);
};

const getAllOrders = async (req, res) => {
    const orders = await ordersService.getAllOrders();
        res.status(200).render('manager/orders', {
            orders,
            username: req.session.username,
            isAdmin: req.session.isAdmin,
        });
};

const updateOrderStatus = async (req, res) => {
    const id = req.body.id;
    try {
        const order = await ordersService.updateOrderStatus(id);
        if (!order) {
            return res.status(404).json({ errors: ['order not found'] });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update order' });
    }
};

const cancelOrder = async (req, res) => {
    const id = req.params.id;
    const order = await ordersService.cancelOrder(id);
    if (!order) {
        return res.status(404).json({ errors: ['order not found'] }); 
    }
    res.send();
};

module.exports = { 
    getMyOrders,
    getAllOrders, 
    cancelOrder,
    updateOrderStatus
};