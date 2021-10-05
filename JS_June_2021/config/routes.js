const homeController = require('../controlers/homeController');
const userController = require('../controlers/userController');
// const accessoryRouter = require('../controllers/accessory');
// const cubeAccessoryRouter = require('../controllers/cubeAccessory');
// const authRouter = require('../controllers/auth');
// const errorRouter = require('../controllers/error');
// // const isAuthenticated = require('../middlewares/isAuthenticated');
// const authGuard = require('../middlewares/check-auth');

module.exports = (app) => {
	app.use('/', homeController);
	app.use('/user', userController)
	// app.use('/cube', cubeRouter);
	// app.use('/accessory', authGuard(true), accessoryRouter);
	// app.use('/cube/:cubeId/accessory', authGuard(true), cubeAccessoryRouter);
	// app.use('/auth', authRouter);
	// app.use('*', errorRouter);
};
