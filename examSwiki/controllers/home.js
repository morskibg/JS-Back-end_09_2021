const router = require("express").Router()

router.get("/", async (req, res) => {

	let articles = await req.dbServices.custom.genericSort(sortPropName = 'creationDate', limit = 10, order = 'desc');
  // console.log("🚀 ~ file: home.js ~ line 6 ~ router.get ~ articles", articles)
	// try {
		
	// let articles = await req.dbServices.custom.getAll();
	// articles = articles.sort((x,y) => x.creationDate - y.creationDate).reverse().slice(0,3);
	articles = articles.map( x => { 
		let arr = x.description
			.trim()
			.split(/\s+/)
			.slice(0,50)
			.join(' ');
		arr = arr.slice(-1) === ',' ? arr.slice(0,-1) : arr;    
		x = {...x, description: arr};				
		return x;
	});			
  
	res.render("home", { articles });



	// } catch (error) {
	// 	console.log("🚀 ~ file: home.js ~ line 11 ~ router.get ~ error", error)
	// }

	// if(req.user){
	// 	try {
			
	// 		const newObject = {...articles, description: 'Modified name'}
	// 	} catch (error) {
  //     console.log("🚀 ~ file: home.js ~ line 11 ~ router.get ~ dddddddddddddd", error)
			
	// 	}
  //   console.log("🚀 ~ file: home.js ~ line 8 ~ router.get ~ articles", articles)
	// }

	// req.dbServices.custom.getAll()
	// .then((data) => {
	// 	let articles = data;
	// 	if(req.user){
	// 		articles = data.map( x => { 
	// 			const arr = x.description.trim().split(/\s+/).slice(0,50).join(' ')
	// 			x = {...x, description: arr}				
	// 			return x;
	// 		});			
	// 	} 
	// 	const view = req.user ? "home": "home-guest";    
	// 	res.render(view, { articles })
	// })
	// .catch((err) => console.log("🚀 ~ file: home.js ~ line 11 ~ router.get ~ error", err))
  
	
})

router.get('/search', async (req, res) => {
	let articles = await req.dbServices.custom.getAllWithSearch(req.query);
	
	res.render("all-articles", {searchWord:req.query.search, articles });

})

module.exports = router
