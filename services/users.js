const User = require('../models/user');

const getUserById = async (id) => {
    return await User.findById({_id: id});
};

const getAllUsers = async () => {
    return await User.find()
};

const updateUser = async (id, address, firstName, lastName) => {
    const user = await getUserById(id);
    if (!user)
        return null;
    user.address = address;
    user.firstName = firstName;
    user.lastName = lastName;
    await user.save();
    return user;
};

const createUser = async (username, password, firstName, lastName, gender) => {
    const user = new User({
        _id: username,
        password, firstName, lastName, gender
        // TODO: Decide if we keep empty string or remove field
    })
    await user.save();
};

const deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
    return user;
};

const changeAdmin = async (id, isAdmin) => {
    const user = await getUserById(id);
    if (!user)
        return null;
    user.isAdmin = isAdmin;
    await user.save();
    return user;
};


module.exports = { 
    getUserById, 
    updateUser, 
    getAllUsers,
    createUser,
    deleteUser,
    changeAdmin
 };
