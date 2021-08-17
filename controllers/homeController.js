const router = require('express').Router();

router.get('/', async (req, res) => {
    res.render('home/home');
});

router.get('/404', async (req, res) => {
    res.render('home/404');
});

module.exports = router;