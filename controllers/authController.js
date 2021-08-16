const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isGuest } = require('../middlewears/guards');


router.get('/register', isGuest(), (req, res) => {
    res.render('user/register');
});

router.post('/register',
    isGuest(),
    body('email').trim().isEmail().withMessage('Email must be valid!').bail(),
    body('rePass').custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error('password don\'t match!')
        }
        return true
    }),
    async (req, res) => {
        const { errors } = validationResult(req);
        try {
            if (errors.length > 0) {
                // TODO impruve err message
                throw new Error(errors.map(e => e.msg).join('\n'));
            }
            
            await req.auth.register(req.body.email, req.body.password, req.body.gender);
            res.redirect('/'); //TODO change redirect location 
        } catch (err) {
            console.log(err);
            const ctx = {
                errors: err.message.split('\n'),
                user: {
                    email: req.body.email,
                    gender: req.body.gender
                }
            }
            res.render('user/register', ctx)
        }
    });

router.get('/login', isGuest(), (req, res) => {
    res.render('user/login');
});

router.post('/login', isGuest(), async (req, res) => {
    try {
        await req.auth.login(req.body.email, req.body.password);
        res.redirect('/'); //TODO change redirect location 
        
    } catch (err) {
        console.log(err);
        if (err.type == 'credential') {
            errors = ['incorect username or password!']
        }
        const ctx = {
            errors,
            userData: {
                email: req.body.email
            }
        };
        res.render('user/login', ctx);
    }
});

router.get('/logout', (req, res) => {
    req.auth.logout();
    res.redirect('/');
});

module.exports = router;
