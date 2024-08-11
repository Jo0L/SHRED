const watchService = require('../services/watch');

const createWatch = async (req, res) => {
    const {id, type, color, company, price, gender, img, stock} = req.body;
    const newWatch = await watchService.createWatch(req.body);
    res.json(newWatch);
};

const getWatches = async (req, res) => {
    const watches = await watchService.getWatches();
    res.json(watches);
}

const getWatch = async (req, res) => {
    const watch = await watchService.getWatchById(req.params.id);
    if (!watch) {
        return res.status(404).json({errors: ['watch not found'] }); 
    }

    res.json(watch);
};

const updateWatch = async (req, res) => {
    const { id, price, stock} = req.body;
    if (!req.body.price & !req.body.stock) {
        return res.status(400).json({errors: ['stock or price required'] }); 
    }
    const watch = await watchService.updateWatch(req.body);
    res.json(watch);
};


const deleteWatch = async (req, res) => {
    const watch = await watchService.deleteWatch(req.params.id);
    if (!watch) {
        return res.status(404).json({ errors: ['watch not found'] }); 
    }

    res.send();
};

module.exports = { 
    createWatch, 
    getWatches, 
    getWatch,
    updateWatch,
    deleteWatch
};