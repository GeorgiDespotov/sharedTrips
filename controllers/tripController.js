const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isGuest, isUser } = require('../middlewears/guards');
const userServicess = require('../services/user');

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
    body('carBrand')
        .isLength({ min: 4 })
        .withMessage('Car Brand should be minimum 4 characters long!'),
    body('price')
        .isInt({ min: 1, max: 50 })
        .withMessage('Price should be positive number (from 1 to 50 inclusive)!'),

    async (req, res) => {
        const { errors } = validationResult(req);
        try {
            req.body.creator = req.user._id;
            if (errors.length > 0) {
                throw new Error(errors.map(err => err.msg).join('\n'));
            }
            await req.storage.createTrip(req.body, req.user._id);
            res.redirect('/trips/sharedTrips');
        } catch (err) {
            console.log(err.message);
            const ctx = {
                errors: err.message.split('\n'),
                tripData: {
                    startPoint: req.body.startPoint,
                    endPoint: req.body.endPoint,
                    date: req.body.date,
                    time: req.body.time,
                    carImage: req.body.carImage,
                    carBrand: req.body.carBrand,
                    seats: Number(req.body.seats),
                    price: Number(req.body.price),
                    description: req.body.description
                }
            }
            res.render('trips/create', ctx);
        }
    });

router.get('/sharedTrips', async (req, res) => {
    try {
        const trips = await req.storage.getAllTrips();
        res.render('trips/sharedTrips', { trips });
    } catch (err) {
        console.log(err.message);
        res.redirect('/404');
    }
});

router.get('/details/:id', async (req, res) => {
    try {
        const trip = await req.storage.getOneTrip(req.params.id);
        const user = await userServicess.getUserById(trip.creator);

        if (req.user) {

            trip.isLoged = req.user ? true : false;
            trip.isCreator = req.user._id == trip.creator;
            trip.haveSeats = trip.seats > 0 ? true : false;
            trip.userAllreadyJoined = trip.buddies.find(b => b._id == req.user._id);
            trip.hasBuddies = trip.buddies.map(b => b.email).join(' ,');
        }

        trip.driver = user.email;

        res.render('trips/details', { trip });
    } catch (err) {
        console.log(err.message);
        res.redirect('/404');
    }
});

router.get('/joinTrip/:id', isUser(), async (req, res) => {
    try {
        const trip = await req.storage.getOneTrip(req.params.id);
        const alreadyJoined = trip.buddies.find(b => b._id == req.user._id);
        if (req.user._id == trip.creator) {
            throw new Error('You can\'t join a trip you created!');
        }

        if (trip.seats <= 0) {
            throw new Error('There are no available seats!');
        }

        if (alreadyJoined) {
            throw new Error('You can\'t join twice to the same trip!'); 
        }

        await req.storage.joinTrip(req.user._id, req.params.id);
        res.render('trips/details', { trip });
    } catch (err) {
        console.log(err.message);
        res.redirect('/404');
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    try {
        const trip = await req.storage.getOneTrip(req.params.id);

        if (req.user._id != trip.creator) {
            throw new Error('Only the creator can delete this offer!');
        }
        await req.storage.deleteTrip(req.params.id);
        res.redirect('/trips/sharedTrips');
    } catch (err) {
        console.log(err.message);
        res.redirect('/404');
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    try {
        const trip = await req.storage.getOneTrip(req.params.id);

        if (req.user._id != trip.creator) {
            throw new Error('Only the aouthor can edit this offer!');
        }
        res.render('trips/edit', { trip });
    } catch (err) {
        console.log(err.message);
        res.redirect('/404');
    }
});

router.post('/edit/:id', isUser(),
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
    body('carBrand')
        .isLength({ min: 4 })
        .withMessage('Car Brand should be minimum 4 characters long!'),
    body('price')
        .isInt({ min: 1, max: 50 })
        .withMessage('Price should be positive number (from 1 to 50 inclusive)!'),
    async (req, res) => {
        const { errors } = validationResult(req);

        try {
            const trip = await req.storage.getOneTrip(req.params.id);

            if (req.user._id != trip.creator) {
                throw new Error('Only the creator can edit this offer!');
            }

            if (errors.length > 0) {
                throw new Error(errors.map(err => err.msg).join('\n'));
            }

            await req.storage.editTrip(req.params.id, req.body);
            res.redirect(`/trips/details/${req.params.id}`);
        } catch (err) {
            console.log(err.message);
            const ctx = {
                errors: err.message.split('\n'),
                trip: {
                    _id: req.params.id,
                    startPoint: req.body.startPoint,
                    endPoint: req.body.endPoint,
                    endPoint: req.body.endPoint,
                    date: req.body.date,
                    time: req.body.time,
                    carImage: req.body.carImage,
                    carBrand: req.body.carBrand,
                    seats: Number(req.body.seats),
                    price: Number(req.body.price),
                    description: req.body.description
                }
            }
            res.render('trips/edit', ctx);
        }
    });

module.exports = router;