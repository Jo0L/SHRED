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

const getAllOrdersStats = async (req, res) => {
    try {
        const orders = await ordersService.getAllOrders();
        // Aggregate monthly sales
        const salesByMonth = {};
        orders.forEach(order => {
            const month = new Date(order.date).toLocaleString('default', { month: 'long' });
            if (!salesByMonth[month]) salesByMonth[month] = 0;
            salesByMonth[month] += order.price;
        });

        //res.json({ orders, salesByMonth });
        res.json(orders);

    } catch (error) {
        res.status(500).send('Error fetching order statistics');
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const order = await ordersService.updateOrderStatus(req.params.id);
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

const renderStatsPage = async (req, res) => {
    res.render('manager/statistics', {
            username: req.session.username,
            isAdmin: req.session.isAdmin,
        });
}

module.exports = { 
    getMyOrders,
    getAllOrders, 
    getAllOrdersStats,
    cancelOrder,
    updateOrderStatus,
    renderStatsPage
};