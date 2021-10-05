const homeRouter = require('../controllers/home');
const cubeRouter = require('../controllers/cube');
const accessoryRouter = require('../controllers/accessory');
const cubeAccessoryRouter = require('../controllers/cubeAccessory');
const authRouter = require('../controllers/auth');
const errorRouter = require('../controllers/error');
// const isAuthenticated = require('../middlewares/isAuthenticated');
const authGuard = require('../middlewares/check-auth');

module.exports = (app) => {
	app.use('/', homeRouter);
	app.use('/cube', cubeRouter);
	app.use('/accessory', authGuard(true), accessoryRouter);
	app.use('/cube/:cubeId/accessory', authGuard(true), cubeAccessoryRouter);
	app.use('/auth', authRouter);
	app.use('*', errorRouter);
};
