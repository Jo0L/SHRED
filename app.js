require('dotenv').config(); 
const { existsSync } = require('fs');
const express = require('express');
const session = require('express-session');
const mongoose =  require('mongoose');
const login = require('./routes/login')
const accessories = require('./routes/accessories')
const users = require('./routes/users')
const orders = require('./routes/orders')

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
server.get('/manager', ensureAdmin, (req, res) => res.render('manager', {username: req.session.username}));
['/account', '/cart'].forEach(page => {
    server.use(page, require('./routes/login'));
    server.get(page, ensureAuthenticated, (req, res, next) => next());
})

// ROUTERS
server.use('', login);
server.use('/accessories', accessories);
server.use('/users', users);
server.use('/orders', orders);

// static HTML with and without its suffix
server.use(express.static('public'))
server.get('/', (req, res) => res.render('index', {username: req.session.username}));
server.get('/:page', (req, res, next) => {
    const page = req.params.page;
    if (existsSync(`${__dirname}/views/${page}.ejs`)){
        res.render(page, {username: req.session.username});
    } else {
        next();
    }
});


server.listen(process.env.PORT);