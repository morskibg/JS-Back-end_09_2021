const router = require('express').Router();
const cubeService = require('../services/cubeService');

// router.get('/', async (req, res) => {
// const cubes = await cubeService.getAll();
// res.render('index', { title: 'Browse', cubes });
// });

router.get('/', (req, res) => {
	cubeService.getAll(req.query)
		.then((cubes) => {
			res.render('index', { title: 'Browse', cubes });
		})
		.catch((err) => console.log(err));
});

router.get('/about', (req, res) => {
	res.render('about');
});

module.exports = router;
