const createRouter = require('../controllers/create');
const aboutRouter = require('../controllers/about');
const homeRouter = require('../controllers/home');
const detailsRouter = require('../controllers/details');
const errorRouter = require('../controllers/error');

module.exports = (app) => {
    
    app.use('/create', createRouter);
    app.use('/about', aboutRouter);
    app.use('/', homeRouter);
    app.use('/details', detailsRouter);    
    app.use('*', errorRouter);
};