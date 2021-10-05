// const env = process.env.NODE_ENV || 'development';
const router = require('express').Router();
const service = require('../services/authService');
const { cookieName } = require('../config/config');
// const isAuthenticated = require('../middlewares/isAuthenticated');
// const isGuest = require('../middlewares/isGuest');
const authGuard = require('../middlewares/check-auth');

// router.get('/register', isGuest, (req, res) => {
// 	res.render('registerPage');
// });

// router.post('/register', isGuest, async (req, res) => {
// 	const { username, password, repeatPassword } = req.body;
// 	try {
// 		await service.addUser(username, password, repeatPassword);
// 		res.redirect('/auth/login');
// 	} catch (error) {
// 		res.render('registerPage', { error });
// 	}
// });

// router.get('/login', isGuest, (req, res) => {
// 	res.render('loginPage');
// });

// router.get('/logout', isAuthenticated, (req, res) => {
// 	res.clearCookie(cookieName);
// 	res.redirect('/');
// });

// router.post('/login', isGuest, async (req, res) => {
// 	try {
// 		const token = await service.login(req.body.username, req.body.password);
// 		const oneDayToSeconds = 24 * 60 * 60;
// 		res.cookie(cookieName, token, {
// 			maxAge: oneDayToSeconds,
// 			httpOnly: true,
// 		});
// 		res.redirect('/');
// 	} catch (error) {
// 		res.render('loginPage', { error });
// 	}
// });

router.get('/register', authGuard(false), (req, res) => {
	res.render('registerPage');
});

router.post('/register', authGuard(false), async (req, res) => {
	const { username, password, repeatPassword } = req.body;
	try {
		await service.addUser(username, password, repeatPassword);
		res.redirect('/auth/login');
	} catch (error) {
		res.render('registerPage', { error });
	}
});

router.get('/login', authGuard(false), (req, res) => {
	res.render('loginPage');
});

router.get('/logout', authGuard(true), (req, res) => {
	res.clearCookie(cookieName);
	res.redirect('/');
});

router.post('/login', authGuard(false), async (req, res) => {
	try {
		const token = await service.login(req.body.username, req.body.password);
		const oneDayToSeconds = 24 * 60 * 60;
		res.cookie(cookieName, token, {
			maxAge: oneDayToSeconds,
			httpOnly: true,
		});
		res.redirect('/');
	} catch (error) {
		res.render('loginPage', { error });
	}
});

module.exports = router;
