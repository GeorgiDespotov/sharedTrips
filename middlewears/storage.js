const tripServices = require('../services/trips');

module.exports = () => (req, res, next) => {
    req.storage = {
        ...tripServices
    };
    next();
};