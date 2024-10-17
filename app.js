require('dotenv').config(); 
const { existsSync } = require('fs');

const express = require('express');
const session = require('express-session');
const mongoose =  require('mongoose');

const login = require('./routes/login')
const accessories = require('./routes/accessories')
const users = require('./routes/users')
const orders = require('./routes/orders')
const cart = require('./routes/cart')
const wishlist = require('./routes/wishlist')
const manager = require('./routes/manager')
const paymentRoutes = require('./routes/payment');
const location = require('./routes/location');

const { ensureAuthenticated, ensureAdmin } = require('./controllers/login')

// MONGO
mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

// EXPRESS
const server = express();
server.use(express.urlencoded({extended: false}));
server.use(express.json());
server.use(session({secret: 'root', saveUninitialized: false, resave: false}));
server.set('view engine', 'ejs');
server.use('/favicon.ico', express.static('public/icons/favicon.ico'));

// AUTHENTICATION
server.use('/manager', require('./routes/login'));
// Define Middleware for '/manager' and all its sub-routes
server.use('/manager', ensureAdmin, (req, res, next) => next());

['/account', '/cart', '/payment', '/payment-success'].forEach(page => {
    server.use(page, require('./routes/login'));
    server.get(page, ensureAuthenticated, (req, res, next) => next());
})

// ROUTERS
server.use('', login);
server.use('/accessories', accessories);
server.use('/users', users);
server.use('/cart', cart);
server.use('/wishlist', wishlist);
server.use('/orders', orders);
server.use('/location', location);
server.use('/manager', manager);
server.use('/', paymentRoutes);

// static HTML with and without its suffix
server.use(express.static('public'))
server.get('/', (req, res) => res.render('index', {username: req.session.username, isAdmin: req.session.isAdmin}));
server.get('/:page', (req, res, next) => {
    const page = req.params.page;
    if (existsSync(`${__dirname}/views/${page}.ejs`)){
        res.render(page, {username: req.session.username, isAdmin: req.session.isAdmin});
    } else {
        next();
    }
});

// 404 Page Middleware
server.use((req, res) => {
    res.status(404).render('404', {username: req.session.username, isAdmin: req.session.isAdmin});
});

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
