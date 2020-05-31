const express = require('express');
const router = express.Router();
const accountRouter = require('../account/account.router');

router.get('/', (req, res) => {
	res.render('session/home');
});

router.use('/account', accountRouter);

module.exports = router;