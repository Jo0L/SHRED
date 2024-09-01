const User = require('../models/user');

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

module.exports = { login, register };
