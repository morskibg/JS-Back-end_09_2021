const router = require('express').Router();
const cubeService = require('../services/cubeService');
const isAuthenticated = require('../middlewares/isAuthenticated');
const isGuest = require('../middlewares/isGuest');
const authGuard = require('../middlewares/check-auth');
// const accessoryService = require('../services/accessoryService');
// const cubeAccessoryController = require('./cubeAccessory');

// router.use('/:cubeId/accessory', cubeAccessoryController);

router.get('/create', isAuthenticated, (req, res) => {
	res.render('create', { title: 'Create' });
});

// router.post('/create', isAuthenticated, (req, res) => {
// 	cubeService.addCube(
// 		req.body.name, req.body.description, req.body.imageUrl,
// 		req.body.difficultyLevel, req.user.userId,
// 	)
// 		.then(() => {
// 			console.log('saved');
// 			res.redirect('/');
// 		})
// 		.catch((error) => console.log(error));
// });

router.post('/create', authGuard(true), async (req, res) => {
	try {
		await cubeService.addCube(
			req.body.name, req.body.description, req.body.imageUrl,
			req.body.difficultyLevel, req.user.userId,
		);
	} catch (error) {
		console.log(error);
	} finally {
		res.redirect('/');
	}
});

router.get('/details/:id', (req, res) => {
	cubeService.getCubeById(req.params.id)
		.then((currCube) => {
			const isCreator = (req.user) ? req.user.userId === currCube.creatorId : false;
			res.render('details', { currCube, isCreator });
		})
		.catch((err) => console.log(err));
});

router.get('/:id/edit', authGuard(true), (req, res) => {
	cubeService.getCubeById(req.params.id)
		.then((currCube) => {
			res.render('editCubePage', currCube);
		})
		.catch((err) => console.log(err));
});

router.post('/:id/edit', authGuard(true), async (req, res) => {
	try {
		await cubeService.updateCubeById(req.params.id, req.body);
	} catch (error) {
		console.log(error);
	} finally {
		res.redirect('/');
	}
});

router.get('/:id/delete', authGuard(true), (req, res) => {
	cubeService.getCubeById(req.params.id)
		.then((currCube) => {
			res.render('deleteCubePage', currCube);
		})
		.catch((err) => console.log(err));
});

router.post('/:id/delete', authGuard(true), async (req, res) => {
	try {
		await cubeService.deleteCubeById(req.params.id);
	} catch (error) {
		console.log(error);
	} finally {
		res.redirect('/');
	}
});

// router.get('/attach/:id', (req, res) => {
// 	cubeService.getCubeById(req.params.id)
// 		.then((currCube) => {
// 			accessoryService.getAvailableAccessories(currCube._id)
// 				.then((accessories) => {
// 					console.log('accessories: ', accessories);
// 					res.render('attachAccessory', { currCube, accessories, isFullOrEmpty: accessories.length === currCube.accessories.length });
// 				});
// 		})
// 		.catch((err) => console.log(err));
// });

// router.post('/attach/:id', (req, res) => {
// 	accessoryService.getAccessoryById(req.body.accessory)
// 		.then((acc) => {
// 			cubeService.attachAccessoryToCube(req.params.id, acc._id);
// 			accessoryService.attachCubeToAccessory(req.params.id, acc._id);
// 			console.log('redirectinggggg');
// 			res.redirect('/');
// 		})
// 		.catch((err) => console.log(err));
// });

// router.post('/attach/:id', async (req, res) => {
// 	// const currCube = await cubeService.getCubeById(req.params.id);
// 	// const cubeId = currCube._id.toString();
// 	const currAccessory = await accessoryService.getAccessoryById(req.body.accessory);
// 	const accessoryId = currAccessory._id.toString();
// 	const allPromise = Promise.all([cubeService.attachAccessoryToCube(req.params.id, accessoryId),
// 		accessoryService.attachCubeToAccessory(req.params.id, accessoryId)]);
// 	allPromise
// 		.then(() => {
// 			console.log('Successifull attached accessory to cube and vice versa');
// 			res.redirect('/');
// 		})
// 		.catch((err) => console.log(err));
// });

module.exports = router;
