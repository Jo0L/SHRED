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
        const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if no page query param
        const limit = 9;

        if (id) {
            return getAccessory(req, res); // Forward to getAccessory if ID is present
        }

        const capitalizedTitle = type.charAt(0).toUpperCase() + type.slice(1);

        // Fetch filtered and sorted accessories
        const accessories = await accessoriesService.filterAndSortAccessories({
            type,
            gender: req.query.gender,
            sortBy: req.query.sortBy,
            search: req.query.search,
            color: req.query.color,
            page,
            limit
        });

        const totalAccessories = await accessoriesService.getAccessoryCount({
            type,
            gender: req.query.gender,
            search: req.query.search,
            color: req.query.color
        });
        
        const totalPages = Math.ceil(totalAccessories / limit);

        // Fetch distinct colors
        const colors = await accessoriesService.getDistinctColors();

        res.status(200).render('accessories', {
            accessories,
            capitalizedTitle,
            username: req.session.username,
            isAdmin: req.session.isAdmin,
            colors, // Pass colors to the view
            currentPage: page,
            totalPages,
            sortBy: req.query.sortBy || '',
            type: req.query.type || '',
            color: req.query.color || '',
            gender: req.query.gender || '',
            search: req.query.search || ''
        });

    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Failed to fetch accessories' });
    }
};



const getAllProducts = async (req, res) => {
    try {
        const type = 'all';
        const accessories = await accessoriesService.getAccessories(type);
        res.status(200).render('manager/products', {
            accessories,
            username: req.session.username,
            isAdmin: req.session.isAdmin,
        });

    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

const getAccessory = async (req, res) => {
    const accessory = await accessoriesService.getAccessoryById(req.query.id);
    if (!accessory) {
        return res.status(404).json({errors: ['Accessory not found'] }); 
    }

    res.status(200).render('accessory', { accessory, username: req.session.username, isAdmin: req.session.isAdmin });;
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
    const id = req.params.id;
    const accessory = await accessoriesService.deleteAccessory(id);
    if (!accessory) {
        return res.status(404).json({ errors: ['Accessory not found'] }); 
    }

    res.send();
};

// Updated to use filterAndSortAccessories
const filterAndSortAccessories = async (req, res) => {
    try {
        const type = req.query.type || 'all';
        const color = req.query.color || '';
        const gender = req.query.gender || '';
        const sortBy = req.query.sortBy || '';
        const search = req.query.search || '';
        const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if no page query param
        const limit = 9;

        // Fetch filtered and sorted accessories
        const accessories = await accessoriesService.filterAndSortAccessories({
            type,
            gender,
            sortBy,
            search,
            color,
            page,
            limit
        });

        const totalAccessories = await accessoriesService.getAccessoryCount({
            type,
            gender,
            search,
            color
        });
        
        const totalPages = Math.ceil(totalAccessories / limit);

        // Fetch distinct colors
        const colors = await accessoriesService.getDistinctColors();

        res.status(200).render('accessories', {
            accessories,
            capitalizedTitle: type.charAt(0).toUpperCase() + type.slice(1),
            username: req.session.username,
            isAdmin: req.session.isAdmin,
            colors, // Pass colors to the view
            currentPage: page, // Pass currentPage to the view
            totalPages,
            sortBy,
            type,
            color,
            gender,
            search
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to filter accessories' });
    }
};


module.exports = { 
    createAccessory, 
    getAccessories, 
    getAccessory,
    updateAccessory,
    deleteAccessory,
    filterAndSortAccessories,
    getAllProducts
};
