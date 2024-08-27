const accessoriesService = require('../services/accessories');


const createAccessory = async (req, res) => {
    const { type, color, company, price, gender, img, stock } = req.body;
    try {
        const newAccessory = await accessoriesService.createAccessory(type, color, company, price, gender, img, stock);
        res.status(201).json(newAccessory);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create accessory' });
    }
};
const getAccessories = async (req, res) => {
    try {
        
        // Get type of accessory
        const type = req.params.type?? 'all' ;
        const capitalizedTitle = type.charAt(0).toUpperCase() + type.slice(1);

        // Assuming this is a placeholder for real data
        const accessories = await accessoriesService.getAccessories(type);

        
        res.status(200).render('accessories', { accessories, capitalizedTitle, username: req.session.username });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Failed to fetch accessories' });
    }
};

const getAccessory = async (req, res) => {
    const Accessory = await accessoriesService.getAccessoryById(req.params.id);
    if (!Accessory) {
        return res.status(404).json({errors: ['Accessory not found'] }); 
    }

    res.json(Accessory);
};


const updateAccessory = async (req, res) => {
    const { id, price, stock } = req.body;
    if (!price && !stock) {
        return res.status(400).json({ errors: ['stock or price required'] });
    }
    try {
        const accessory = await accessoriesService.updateAccessory(id, price, stock);
        if (!accessory) {
            return res.status(404).json({ errors: ['Accessory not found'] });
        }
        res.json(accessory);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update accessory' });
    }
};


const deleteAccessory = async (req, res) => {
    const accessory = await accessoriesService.deleteAccessory(req.params.id);
    if (!accessory) {
        return res.status(404).json({ errors: ['Accessory not found'] }); 
    }

    res.send();
};

module.exports = { 
    createAccessory, 
    getAccessories, 
    getAccessory,
    updateAccessory,
    deleteAccessory
};