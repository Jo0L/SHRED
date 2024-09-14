const loginService = require('../services/login');

const ensureAuthenticated = async (req, res, next) => {
    if (req.session.username != null)
        return next();
    res.redirect('/login');
}

const ensureAdmin = async (req, res, next) => {
    if (req.session.isAdmin)
        return next();
    res.redirect('/');
}

const logout = async (req, res) => {
    req.session.destroy(() => res.redirect('/'));
}

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await loginService.login(username, password);
        if (result) {
            req.session.username = username;
            req.session.isAdmin = result.isAdmin ?? false;
            res.redirect('/');
        } else {
            req.session.error = 'Username or password incorrect.';
            res.render('login', { error: req.session.error });
        }
    } catch (error) {
        console.error('Login error:', error);
        req.session.error = 'An error occurred during login.';
        res.render('login', { error: req.session.error });
    }
}

const register = async (req, res) => {
    const { username, password, firstName, lastName, gender } = req.body;
    try {
        await loginService.register(username, password, firstName, lastName, gender);
        req.session.username = username;
        res.redirect('/');
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern._id) {
            // Handle the duplicate key error (username already taken)
            const errorMessage = 'The username is already taken.';
            res.render('register', { error: errorMessage });
        } else {
            console.error('Registration error:', error);
            const errorMessage = 'An error occurred during registration. Please try again.';
            res.render('register', { error: errorMessage });
        }
    }
};

module.exports = { ensureAuthenticated, ensureAdmin, login, register, logout };