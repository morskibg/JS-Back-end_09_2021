const router = require('express').Router();
const userService = require('../services/userServices');
const { cookieName } = require('../config/config');

router.get('/register', (req, res) => {

	res.render('register');

});

router.post('/register', async (req, res, next) => {
	// try {
	await userService.addUser(req.body);	
	res.redirect('/')	
	// } catch (error) {
	// 	next(error);
	// 	res.redirect('/');	
	// }
});

router.get('/login', (req, res) => {

	res.render('login');

});

router.post('/login', async (req, res) => {
	try {
		const token = await userService.login(req.body);
		const oneDayToSeconds = 24 * 60 * 60;
		res.cookie(cookieName, token, {
			maxAge: oneDayToSeconds,
			httpOnly: true,
		});
		res.redirect('/');
	} catch (error) {
		res.render('login', { error });
	}

});

module.exports = router;