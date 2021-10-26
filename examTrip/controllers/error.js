const router = require("express").Router()

router.all("*", async (req, res) => {
	// const customs = req.user ? await req.dbServices.custom.getAllSortedBuyers('asc') : {}

	res.render("404", {  })
})

module.exports = router