const User = require('../models/user');

const getUserById = async (id) => {
    return await User.findById({_id: id});
};

const updateUser = async (id, address, mail) => {
    const user = await getUserById(id);
    if (!user)
        return null;
    user.address = address;
    user.mail = mail;
    await user.save();
    return user;
};

module.exports = { getUserById, updateUser };
