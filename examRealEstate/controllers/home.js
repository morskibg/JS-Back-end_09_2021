const router = require("express").Router()

router.get("/", async (req, res) => {
	let customs = await req.dbServices.custom.getAll();
	if(customs.length > 3){
		customs = customs.slice(customs.length - 3);
	}
	res.render('home', { customs })
	
});

module.exports = router
