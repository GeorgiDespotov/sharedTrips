const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');
const tripsController = require('../controllers/tripController');


module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/trips', tripsController);
}