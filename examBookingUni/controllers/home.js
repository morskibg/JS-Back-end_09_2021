const router = require("express").Router()

router.get("/", async (req, res) => {
	let customs = await req.dbServices.custom.getAll();
	customs.forEach(element => {
		element.calcRooms = element.freeRooms - element.bookers.length;
	});
  customs = customs.sort((a,b) => (a.calcRooms > b.calcRooms) ? 1 : ((b.calcRooms > a.calcRooms) ? -1 : 0));
	customs.reverse();
	res.render("home pages/home", { customs } );
})

module.exports = router
