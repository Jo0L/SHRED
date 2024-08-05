const loginService = require('../services/login');

const ensureAuthenticated = async (req, res, next) => {
    if (req.session.username != null)
        return next();
    res.redirect('/login');
}

const logout = async (req, res) => {
    req.session.destroy(() => res.redirect('/'));
}

const login = async (req, res) => {
    const { username, password } = req.body;
    const result = await loginService.login(username, password);
    console.log(result);
    if (result){
        req.session.username = username;
        res.redirect('/');
    } else {
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

module.exports = { ensureAuthenticated, login, register, logout };