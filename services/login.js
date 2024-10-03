const User = require('../models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();      

const register = async (username, password, firstName, lastName, gender) => {
    const user = new User({
        _id: username,
        password, firstName, lastName, gender
        // TODO: Decide if we keep empty string or remove field
    })
    await user.save();
}

const login = async (username, password) => {
    const user = await User.findOne({
        _id: username,
        password,
    });
    return user;
}

const sendResetEmailToUser = async (username) => {
    const user = await User.findOne({
        _id: username,
    });
   
    if (!user) {
        return "404";
    }

    // Generate a password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // Token expires in 1 hour
    
    try {
        // Store the reset token and its expiration time in the user database
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpires;
        
        await user.save();
    }
    catch {
        return false
    }
  
    // Create a password reset link
    const resetUrl = `http://${process.env.DOMAIN}:${process.env.PORT}/reset-password/${resetToken}`;


    // Set up Nodemailer transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        }
    });
   

    // Create email
    const mailOptions = {
        from: 'shredpro24@gmail.com',
        to: username,
        subject: 'SHRED: Password Reset Request',
        html: `
            <p>You requested a password reset. Click the button below to reset your password:</p>
            <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; font-size: 16px;">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
        `
    };
 
    // Send Email
    const result = await transporter.sendMail(mailOptions);
   
    if(result) {
        return true;
    }
    else {
        return false;
    }
}


const resetPassword = async (token, newPassword) => {
    // Find the user by the reset token and check if it's still valid
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() } // Check if token is still valid
    });

    if (!user) {
        return false;
    }

    try {
        // Update the user's password
        user.password = newPassword; // Make sure to hash the password
        user.resetPasswordToken = undefined; // Clear the reset token
        user.resetPasswordExpires = undefined; // Clear the expiration time
        await user.save();

        return true;
    }
    catch {
        return false;
    }
}

module.exports = { login, register, sendResetEmailToUser, resetPassword };
