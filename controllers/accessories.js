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

// Updated getAccessories method
const getAccessories = async (req, res) => {
    try {
        const type = req.query.type || 'all';
        const id = req.query.id;

        if (id) {
            return getAccessory(req, res);
        } // Forward the request to getAccessory

        const capitalizedTitle = type.charAt(0).toUpperCase() + type.slice(1);

        // Call the filterAndSortAccessories method
        const accessories = await accessoriesService.filterAndSortAccessories({
            type,
            gender: req.query.gender,
            brand: req.query.brand,
            sortBy: req.query.sortBy,
            search: req.query.search
        });

        res.status(200).render('accessories', { accessories, capitalizedTitle, username: req.session.username });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Failed to fetch accessories' });
    }
};

const getAccessory = async (req, res) => {
    const accessory = await accessoriesService.getAccessoryById(req.query.id);
    if (!accessory) {
        return res.status(404).json({errors: ['Accessory not found'] }); 
    }

    res.status(200).render('accessory', { accessory, username: req.session.username });
};

const updateAccessory = async (req, res) => {
    const { id, price, stock } = req.body;
    if (!price && !stock) {
        return res.status(400).json({ errors: ['Stock or price required'] });
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

// Updated to use filterAndSortAccessories
const filterAndSortAccessories = async (req, res) => {
    try {
        const query = {
            type: req.query.type || 'all',
            gender: req.query.gender,
            brand: req.query.brand,
            sortBy: req.query.sortBy,
            search: req.query.search
        };

        const capitalizedTitle = query.type.charAt(0).toUpperCase() + query.type.slice(1);

        const accessories = await accessoriesService.filterAndSortAccessories(query);
        
        res.status(200).render('accessories', { accessories, capitalizedTitle, username: req.session.username });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Failed to fetch accessories' });
    }
};

module.exports = { 
    createAccessory, 
    getAccessories, 
    getAccessory,
    updateAccessory,
    deleteAccessory,
    filterAndSortAccessories
};
