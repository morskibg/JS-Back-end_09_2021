const router = require("express").Router()

router.get("/", async (req, res) => {
	let customs = await req.dbServices.custom.getAll();
  customs = customs.sort((a,b) => (a.freeRooms > b.freeRooms) ? 1 : ((b.freeRooms > a.freeRooms) ? -1 : 0));
	customs.reverse()
	res.render("home pages/home", { customs } )
})

module.exports = router
