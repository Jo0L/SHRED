const loginService = require('../services/login');
const usersService = require('../services/users');
const bcrypt = require('bcrypt');
require('dotenv').config();

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
    const secretKey = process.env.SECRET_KEY; // Load the secret key from environment variables

    try {
        // Fetch the user from the database by username
        const user = await usersService.getUserById(username);

        // Check if the user exists and compare the password
        if (user) {
            // Concatenate the input password with the secret key
            const passwordWithKey = password + secretKey;

            // Compare the hashed password stored in the database with the input password
            const isMatch = await bcrypt.compare(passwordWithKey, user.password);

            if (isMatch) {
                // If password matches, set session variables and redirect
                req.session.username = username;
                req.session.isAdmin = user.isAdmin ?? false;
                res.redirect('/');
            } else {
                // If password does not match, show error
                req.session.error = 'Username or password incorrect.';
                res.render('login', { error: req.session.error });
            }
        } else {
            // If user does not exist, show error
            req.session.error = 'Username or password incorrect.';
            res.render('login', { error: req.session.error });
        }
    } catch (error) {
        console.error('Login error:', error);
        req.session.error = 'An error occurred during login.';
        res.render('login', { error: req.session.error });
    }
};

const register = async (req, res) => {
    const { username, password, firstName, lastName, gender } = req.body;
    const secretKey = process.env.SECRET_KEY; // Load the secret key from environment variables
    try {
        // Concatenate the password with the secret key before hashing
        const passwordWithKey = password + secretKey;

        // Hash the concatenated password and secret key
        const hashedPassword = await bcrypt.hash(passwordWithKey, 10); // 10 is the salt rounds

        // Pass the hashed password to the registration service
        await loginService.register(username, hashedPassword, firstName, lastName, gender);

        // Store the username in the session and redirect
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

// Forgat password machanizem
const forgotPassword = async (req, res) => {
    const { username } = req.body;
    try {
        // Send user a reset email
        const result = await loginService.sendResetEmailToUser(username);
        
        if(result === "404") {
            req.session.error = 'There is no user with this email.';
            return res.render('forgot-password', { error: req.session.error });
        }

        if(result) {
            req.session.success = 'Password reset email sent.';
            res.render('forgot-password', { success: req.session.success });
        }
        else {
            req.session.error = 'Failed to send password reset email.';
            res.render('forgot-password', { error: req.session.error });
        }

    } catch (err) {
        req.session.error = 'Failed to send password reset email.';
        res.render('forgot-password', { error: req.session.error });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    
    if(!newPassword) {
        res.render('reset-password', { message: 'Please enter new password.' });
    }
    else {
        try {
            const result = await loginService.resetPassword(token, newPassword);
            if(result) {
                req.session.success = 'Password has been reset.';
                res.render('reset-password', { success: req.session.success });
            }
            else {
                req.session.error = 'Invalid or expired token.';
                res.render('reset-password', { error: req.session.error });
            }

        } catch (err) {
            req.session.error = 'Failed to reset password.';
            res.render('reset-password', { error: req.session.error });
        }
    }
};



module.exports = { ensureAuthenticated, ensureAdmin, login, forgotPassword, resetPassword, register, logout };