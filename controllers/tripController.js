const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isGuest, isUser } = require('../middlewears/guards');

router.get('/create', isUser(), (req, res) => {
    res.render('trips/create');
});

router.post('/create', isUser(),
    body('startPoint')
        .isLength({ min: 4 })
        .withMessage('Starting point must be atleast 4 symbols long!'),
    body('seats')
        .isInt({ min: 0, max: 4 })
        .withMessage('The seats must be from 0 to 4!'),
    body('description')
        .isLength({ min: 10 })
        .withMessage('Description should be minimum 10 characters long!'),
    body('carImage')
        .matches('^https?:\/\/')
        .withMessage('Car image must be valid URL!'),
    body('carBarnd')
        .isLength({ min: 4 })
        .withMessage('Car Brand should be minimum 4 characters long!'),
    body('price')
        .isInt({ min: 1, max: 50 })
        .withMessage('Price should be positive number (from 1 to 50 inclusive)!'),

    (req, res) => {

    });

module.exports = router;