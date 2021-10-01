const router = require('express').Router();
const service = require('../services/accessoryService');

router.get('/create', (req, res) => {
	res.render('createAccessory', { title: 'Create' });
});

router.post('/create', (req, res) => {
	service.addAccessory(req.body.name, req.body.description, req.body.imageUrl)
		.then(() => {
			console.log(`Accessory with name ${req.body.name} saved successifully to DB !`);
			res.redirect('/');
		}).catch((err) => console.log(err));
});

module.exports = router;
