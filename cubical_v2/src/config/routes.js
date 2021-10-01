const homeRouter = require('../controllers/home');
const cubeRouter = require('../controllers/cube');
const accessoryRouter = require('../controllers/accessory');

module.exports = (app) => {
	app.use('/', homeRouter);
	app.use('/cube', cubeRouter);
	app.use('/accessory', accessoryRouter);
};
