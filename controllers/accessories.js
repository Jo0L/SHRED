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
        const type = req.params.type || 'all';
        const id = req.query.id;

        if (id) {
            return getAccessory(req, res); // Forward to getAccessory if ID is present
        }

        const capitalizedTitle = type.charAt(0).toUpperCase() + type.slice(1);

        // Fetch all accessories for rendering
        const accessories = await accessoriesService.filterAndSortAccessories({
            type,
            gender: req.query.gender,
            sortBy: req.query.sortBy,
            search: req.query.search,
            color: req.query.color
        });

        // Fetch distinct colors
        const colors = await accessoriesService.getDistinctColors();

        res.status(200).render('accessories', {
            accessories,
            capitalizedTitle,
            username: req.session.username,
            colors // Pass colors to the view
        });
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

    res.status(200).render('accessory', { accessory, username: req.session.username });;
};

const updateAccessory = async (req, res) => {
    const { id, color, company, price, gender, img, stock } = req.body;
    try {
        const accessory = await accessoriesService.updateAccessory(id, color, company, price, gender, img, stock);
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
            sortBy: req.query.sortBy,
            search: req.query.search,
            color: req.query.color
        };

        const capitalizedTitle = query.type.charAt(0).toUpperCase() + query.type.slice(1);

        const accessories = await accessoriesService.filterAndSortAccessories(query);
        
        // Fetch distinct colors
        const colors = await accessoriesService.getDistinctColors();

        res.status(200).render('accessories', {
            accessories,
            capitalizedTitle,
            username: req.session.username,
            colors // Pass colors to the view
        });
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
