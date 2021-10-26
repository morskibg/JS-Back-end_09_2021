const router = require("express").Router()

router.get("/", async (req, res) => {
	// const customs = req.user ? await req.dbServices.custom.getAllSortedBuyers('asc') : {}

	res.render("home", {  })
})

module.exports = router
