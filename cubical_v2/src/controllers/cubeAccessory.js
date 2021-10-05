const router = require('express').Router({ mergeParams: true });
const cubeService = require('../services/cubeService');
const accessoryService = require('../services/accessoryService');

router.get('/attach', (req, res) => {
	cubeService.getCubeById(req.params.cubeId)
		.then((currCube) => {
			console.log('currCube: ', currCube);
			accessoryService.getAvailableAccessories(currCube.accessories)
				.then((accessories) => {
					console.log('accessories: ', accessories);
					res.render('attachAccessory', { currCube, accessories, isFullOrEmpty: accessories.length === 0 || currCube.accessories.length === 0 });
				});
		})
		.catch((err) => console.log(err));
});

router.post('/attach', async (req, res) => {
	// working with reloading new acc
	// try {
	// 	await cubeService.attachAccessoryToCube(req.params.cubeId, req.body.accessory);
	// 	const currCube = await cubeService.getCubeById(req.params.cubeId);
	// 	res.redirect(`/cube/details/${currCube._id}`);
	// } catch (err) {
	// 	console.log(err);
	// 	res.redirect(`/cube/details/${req.params.cubeId}`);
	// }
	await cubeService.attachAccessoryToCube(req.params.cubeId, req.body.accessory);
	cubeService.getCubeById(req.params.cubeId)
		.then((currCube) => {
			// accessoryService.attachCubeToAccessory(req.params.cubeId, req.body.accessory);
			res.redirect(`/cube/details/${currCube._id}`);
		})
		.catch((err) => console.log(err));
});

module.exports = router;
