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
    const result = await loginService.login(username, password);
    if (result){
        req.session.username = username;
        req.session.isAdmin = result.isAdmin ?? false;

        res.redirect('/');
    } else {
        console.error('Login error:', error);

        res.redirect('/login?error=1');
        // TODO: toast?
    }
}

const register = async (req, res) => {
    const { username, password, firstName, lastName, gender } = req.body;
    try {
        await loginService.register(username, password, firstName, lastName, gender);
        req.session.username = username;
        res.redirect('/');
    } catch (error) {
        res.redirect('/register?error=1');
        // TODO: toast?
    }
}

module.exports = { ensureAuthenticated, ensureAdmin, login, register, logout };