const usersService = require('../services/users');

const getMyUser = async (req, res) => {
    const User = await usersService.getUserById(req.session.username);
    if (!User) {
        return res.status(404).json({errors: ['User not found'] }); 
    }
    res.json(User);
};

const updateUser = async (req, res) => {
    const { address, mail } = req.body;
    try {
        const user = await usersService.updateUser(req.session.username, address, mail);
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
    updateUser
};