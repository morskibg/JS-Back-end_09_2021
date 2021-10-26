const router = require("express").Router()

router.get("/", async (req, res) => {
	let customs = await req.dbServices.custom.getAll(req.query);
	
	
	customs.forEach(element => {
		element.usersLiked = element.usersLiked.length;
	});

	if(req.user){
		if(Object.keys(req.query).length !== 0 && req.query.criteria === 'by-likes'){
			customs = customs.sort((x,y) => x.usersLiked - y.usersLiked).reverse()		
		}else{
			customs = customs.sort(x=>x.createdAt)
		}
	} else{
		customs = customs.sort((x,y) => x.usersLiked - y.usersLiked).reverse().slice(0, 3)    
	}

	view = req.user ? "user-home" : "guest-home"

	res.render(view, { customs })})

module.exports = router


