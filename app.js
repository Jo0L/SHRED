require('dotenv').config(); 
const { existsSync } = require('fs');
const express = require('express');
const session = require('express-session');
const mongoose =  require('mongoose');
const login = require('./routes/login')
const accessories = require('./routes/accessories')

const { ensureAuthenticated } = require('./controllers/login')

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
server.use('/', require('./routes/login'));
server.get('/', ensureAuthenticated, (req, res, next) => next());

// static HTML with and without its suffix
server.use(express.static('public'))
server.get('/:page', (req, res, next) => {
    const filePath = `${__dirname}/public/${req.params.page}.html`
    if (existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        next();
    }
});

// ROUTERS
server.use('', login);
server.use('/accessories', accessories);

server.listen(process.env.PORT);