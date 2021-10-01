const router = require('express').Router();
const cubeService = require('../services/cubeService');
const accessoryService = require('../services/accessoryService');

router.get('/create', (req, res) => {
	res.render('create', { title: 'Create' });
});

router.post('/create', (req, res) => {
	cubeService.addCube(
		req.body.name, req.body.description, req.body.imageUrl, req.body.difficultyLevel,
	).then(() => {
		console.log(`Cube with name ${req.body.name} saved successifully to DB !`);
		res.redirect('/');
	})
		.catch((err) => console.log(err));
});

router.get('/details/:id', (req, res) => {
	cubeService.getCubeById(req.params.id)
		.then((currCube) => {
			res.render('details', { currCube });
		})
		.catch((err) => console.log(err));
});

router.get('/attach/:id', (req, res) => {
	cubeService.getCubeById(req.params.id)
		.then((currCube) => {
			accessoryService.getAllAccessories()
				.then((accessories) => {
					res.render('attachAccessory', { currCube, accessories });
				});
		})
		.catch((err) => console.log(err));
});

router.post('/attach/:id', async (req, res) => {
	const currCube = await cubeService.getCubeById(req.params.id);
	const cubeId = currCube._id.toString();
	const currAccessory = await accessoryService.getAccessoryById(req.body.accessory);
	const accessoryId = currAccessory._id.toString();
	const allPromise = Promise.all([cubeService.attachAccessoryToCube(cubeId, accessoryId),
		accessoryService.attachCubeToAccessory(cubeId, accessoryId)]);
	allPromise
		.then(() => {
			console.log('Successifull attached accessory to cube and vice versa');
			res.redirect('/');
		})
		.catch((err) => console.log(err));
});

// router.post('/attach/:id', (req, res) => {});
module.exports = router;
