const router = require("express").Router()

router.get("/", async (req, res) => {

	// let customs = await req.dbServices.custom.getAll();
	// if(customs.length > 3){
	// 	customs = customs.slice(customs.length - 3);
	// }
	// res.render('home', { customs })
	
	req.dbServices.custom.getAll()
		.then((homes) => {
			if(homes.length > 3){
				homes = homes.slice(homes.length - 3);
			}
			res.render('home', { homes })
		})
	
});

module.exports = router
