const ordersService = require('../services/orders');
const cartService = require('../services/cart');

const createOrder = async (req, res) => {
    const username = req.session.username;
    const { paymentData } = req.body; // Credit card information
   
    if (!username) {
        res.status(401).json({ success: false, message: 'No user is authonticated', localUser: true });
        return;
    }
   
    try {
        const cart = await cartService.getCart(username);
        const status="Processing"; // New order
        
        // Calculate price
        let totalPrice=0;
        if (cart) {
            // Calculate totals
            let subtotal = 0;
            cart.forEach(item => {
                subtotal += item.price * item.quantity;
            });
           
            const shipping = 3.99;
            const taxRate = 0.17;
            totalPrice = (subtotal + shipping) * (1 + taxRate);


            // Create Order
            const newOrderItems = cart.reduce((acc, item) => {

                // Add current item to itemsData
                acc[0].itemsData.push({
                    accessoryId: item.accessoryId,
                    quantity: item.quantity,
                    totalPrice: item.quantity*item.price,
                    price: item.price,
                    title: item.title,
                    img: item.img,
                });
                
                // Update amount in the accumulator
                acc[0].amount += item.quantity;
                
                return acc;
            }, [{
                itemsData: [],
                amount: 0
            }]);
         
            const result = await ordersService.createOrder(username, newOrderItems[0].itemsData, totalPrice, newOrderItems[0].amount, paymentData, status);

            // Delete cart if order was created
            if(result) {
                await cartService.clearCart(username);

                return res.status(200).json({message: 'Order was created successfully' }); 
            }
            else {
                return res.status(404).json({errors: 'Something went wrong' }); 
            }
        }

    }
    catch {
        return res.status(503).json({errors: 'Something went wrong' }); 
    }
};

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
    renderStatsPage,
    createOrder
};