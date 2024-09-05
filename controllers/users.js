const usersService = require('../services/users');

const getMyUser = async (req, res) => {
    const User = await usersService.getUserById(req.session.username);
    if (!User) {
        return res.status(404).json({errors: ['User not found'] }); 
    }
    res.json(User);
};

const getAllUsers = async (req, res) => {
    const users = await usersService.getAllUsers();
        res.status(200).render('manager/users', {
            users,
            username: req.session.username,
            isAdmin: req.session.isAdmin,
        });

};

const updateUser = async (req, res) => {
    const { address, firstName, lastName } = req.body;
    try {
        const user = await usersService.updateUser(req.session.username, address, firstName, lastName);
        if (!user) {
            return res.status(404).json({ errors: ['User not found'] });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

const deleteUser = async (req, res) => {
    const id = req.params.id;
    const user = await usersService.deleteUser(id);
    if (!user) {
        return res.status(404).json({ errors: ['user not found'] }); 
    }
    res.send();
};

const changeAdmin = async (req, res) => {
    const isAdmin = req.body.isAdmin;
    const id = req.params.id;
    if (req.session.username === id) {
        return res.status(403).send({ message: "You cannot change your own admin status" });
    }
    try {
        const user = await usersService.changeAdmin(id, isAdmin);
        if (!user) {
            return res.status(404).json({ errors: ['User not found'] });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

module.exports = { 
    getMyUser,
    updateUser,
    getAllUsers,
    deleteUser,
    changeAdmin
};