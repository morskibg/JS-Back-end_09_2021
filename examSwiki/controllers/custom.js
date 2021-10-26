const router = require("express").Router()
const { usersOnly, ownerOnly, notOwnerOnly } = require("../middlewares/routeGuards")
const { body, validationResult } = require("express-validator")
const custom = require("../db/services/custom")
const { createErrorMsg } = require("../helpers/helper")

router.get('/', async (req, res) => {
	// const articles = await req.dbServices.custom.getAll()
	const articles = await req.dbServices.custom.genericSort(sortPropName = 'creationDate', limit = 10, order = 'desc');
	const payLoad = {
		articles,
		searchWord: false
	}
	res.render('all-articles', payLoad)
})

// CREATE
router.get("/create", usersOnly, (req, res) => res.render("create"))
router.post(
	"/create",
	usersOnly,
	body('title')
		.isLength({ min: 4 })
		.withMessage('Title must be at least 4 symbols long.'),	
	body('description')
		.isLength({ min: 20 })
		.withMessage('Description. must be at least 20 symbols'),	
	async (req, res) => {
		const errors = validationResult(req)
		// console.log("🚀 ~ file: custom.js ~ line 31 ~ req.body", req.body)
		if (errors.isEmpty()) {
			const custom = {
				title: req.body.title,				
				description: req.body.description,        
				author: req.user._id,	
				creationDate: Date.now(),			
			}

			const article = await req.dbServices.custom.create(custom)
			// await req.dbServices.user.addTrip(trip._id, req.user._id)

			res.redirect('/')

			// adding to catch validation errors in db creation models
			// try {
			// 	const hotel = await req.dbServices.custom.create(custom);				
			// 	await req.dbServices.user.addHotel(hotel._id, req.user._id);	
			// 	res.redirect('/');
			// } catch (error) {
			// 	res.locals.errors = error.message;
		  //   res.render('booking pages/create', req.body);
			// }

		} else {
			res.locals.errors = createErrorMsg(errors)

			res.render("create", req.body)
		}
	},
)

// DETAILS
// added guard for users only !!!!!!
router.get(
	"/details/:id", usersOnly,
	async (req, res) => {		
		let custom = await req.dbServices.custom.getById(req.params.id);   
		custom.isOwn = req.user ? custom.author.equals(req.user._id) : false;		
		custom.description =  custom.description.replace(new RegExp('\r\n\r\n','g'), '</p><p>');		
		res.render('details', custom);    
	},
)

// DELETE
router.get(
	"/delete/:id",
	ownerOnly, async (req, res) => {
		await req.dbServices.custom.deleteById(req.params.id)
		res.redirect('/custom')
	},
)

// EDIT
router.get(
	"/edit/:id",
	ownerOnly,
	async (req, res) => {
		const article = await req.dbServices.custom.getById(req.params.id)
		res.render("edit", article)
	},
)
router.post(
	"/edit/:id",	
	body('description')
		.isLength({ min: 20 })
		.withMessage('Description. must be at least 20 symbols'),	
	async (req, res) => {
		const errors = validationResult(req);

		if (errors.isEmpty()) {
			const updatedArticle = {								
				description: req.body.description,
			}
			await req.dbServices.custom.updateById(req.params.id, updatedArticle);
			res.redirect(`/custom/details/${req.params.id}`);
		} else {
			res.locals.errors = createErrorMsg(errors);
			res.render("edit", req.body);
		}
	},
)
// router.get(
// 	"/show/:id",
// 	ownerOnly, async (req, res) => {
// 		const article = await req.dbServices.custom.getById(req.params.id)
// 		res.render('details', article)
// 	},
// )
module.exports = router
