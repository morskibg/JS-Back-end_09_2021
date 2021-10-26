const router = require("express").Router()
const { usersOnly, ownerOnly, notOwnerOnly } = require("../middlewares/routeGuards")
const { body, validationResult } = require("express-validator")

const { createErrorMsg } = require("../helpers/helper")

router.get('/', async (req, res) => {
	const customs = await req.dbServices.custom.getAll()

	res.render('custom', { customs })
})

// CREATE
router.get("/create", usersOnly, (req, res) => res.render("create"))
router.post(
	"/create",
	usersOnly,
	body('title')
		.exists({checkFalsy: true})
		.withMessage('Title must exist!'),	
	body('description')
		.exists({checkFalsy: true})
		.withMessage('Description must exist!')
		.isLength({ max: 50 })
		.withMessage('Description. must be max 50 symbols'),
	body('imageUrl')
		.exists({checkFalsy: true})
		.withMessage('Image Url must exist!'),
	
	async (req, res) => {
		const errors = validationResult(req)

		if (errors.isEmpty()) {
			const custom = {
				title: req.body.title,
				description: req.body.description,
				imageUrl: req.body.imageUrl,
				isPublic: req.body.isPublic ? true : false ,
				createdAt: Date.now(),				
				usersLiked: [],
				creator: req.user._id,
			}

		
			// res.redirect('/custom')

			// adding to catch validation errors in db creation models
			try {
				const createdCustom = await req.dbServices.custom.create(custom);				
					
				res.redirect('/');
			} catch (error) {
				res.locals.errors = error.message;
		    res.render('create', req.body);
			}

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
		const custom = await req.dbServices.custom.getById(req.params.id)
		// const driverData = await req.dbServices.user.getById(custom.creator)

		if (req.user) {
			custom.isOwn = custom.creator.equals(req.user._id)
			custom.alreadyLiked = custom.usersLiked.some(x => x._id.equals(req.user._id))
		
		}

		// custom.driver = driverData.email
		// custom.buddies = custom.buddies.map(x => x.email).join(', ')

		res.render('details', custom)
	},
)

// DELETE
router.get(
	"/delete/:id",
	ownerOnly, async (req, res) => {
		await req.dbServices.custom.deleteById(req.params.id)
		res.redirect('/')
	},
)

// EDIT
router.get(
	"/edit/:id",
	ownerOnly,
	async (req, res) => {
		const play = await req.dbServices.custom.getById(req.params.id)
		res.render("edit", play)
	},
)
router.post(
	"/edit/:id",
	ownerOnly,	
	body('title')
		.exists({checkFalsy: true})
		.withMessage('Title must exist!'),	
	body('description')		
		.exists({checkFalsy: true})
		.withMessage('Description must exist!')
		.isLength({ max: 50 })
		.withMessage('Description. must be max 50 symbols'),
	body('imageUrl')
		.exists({checkFalsy: true})
		.withMessage('Image URL must exist!'),
	async (req, res) => {
		const errors = validationResult(req)

		if (errors.isEmpty()) {
			const updated = {
				title: req.body.title,
				description: req.body.description,
				imageUrl: req.body.imageUrl,
				isPublic: req.body.isPublic ? true : false ,
				createdAt: Date.now(),			
			}
			await req.dbServices.custom.updateById(req.params.id, updated)

			res.redirect(`/custom/details/${req.params.id}`)
		} else {
			res.locals.errors = createErrorMsg(errors)

			res.render("edit", req.body)
		}
	},
)

router.get('/like/:id', usersOnly, notOwnerOnly, async (req, res) => {
	const custom = await req.dbServices.custom.getById(req.params.id)
	custom.usersLiked.push(req.user._id)

	await req.dbServices.custom.updateById(req.params.id, custom)

	res.redirect(`/custom/details/${req.params.id}`)
})


module.exports = router
