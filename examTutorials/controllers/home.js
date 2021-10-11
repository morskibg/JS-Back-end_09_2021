const router = require("express").Router()

router.get("/", async (req, res) => {
	let customs = await req.dbServices.custom.getAll(req.query);
	let view = "user-home"
	
	if(!req.user){
		customs = customs
			.sort((x,y) => x.users.length - y.users.length)
			.slice(0,3)
			.reverse()
			
		customs.forEach(element => {
			element.usersCount = element.users.length;
		});
		view = "guest-home"
	} 
	res.render(view, { customs })})

module.exports = router


