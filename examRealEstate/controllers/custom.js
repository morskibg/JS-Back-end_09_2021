const router = require("express").Router()
const { usersOnly, ownerOnly, notOwnerOnly } = require("../middlewares/routeGuards")
const { body, validationResult } = require("express-validator")
const custom = require("../db/services/custom")
const { createErrorMsg } = require("../helpers/helper")

router.get('/', async (req, res) => {
	const customs = await req.dbServices.custom.getAll()

	res.render('aprt-for-recent', { customs })
})

// CREATE
router.get("/create", usersOnly, (req, res) => res.render("create"))
router.post(
	"/create",
	usersOnly,
	body('name')
		.escape()
		.trim()
		.isLength({ min: 6 })
		.withMessage('Name must be at least 6 symbols long.'),
	body('type')
		.escape()
		.trim()
		.exists({checkFalsy: true})	
		.withMessage("Type must exist!"),
	body('year')
		.isInt({ min: 1850, max: 2021 })
		.withMessage('Year must be from 1850 to 2021.'),
	body('city')
		.escape()
		.trim()
		.isLength({ min: 4 })
		.withMessage('City must be at least 4 symbols long.'),
	body('homeImg')		
		.isURL({ protocols: ["http", "https"] })
		.withMessage('Home Image must be a valid URL'),	
	body('availablePieces')
		.isInt({ min: 0, max: 10 })
		.withMessage('Available pieces must be from 0 to 10'),
	async (req, res) => {
		const errors = validationResult(req)

		if (errors.isEmpty()) {
			const custom = {
				name: req.body.name,
				type: req.body.type,
				year: req.body.year,
				time: req.body.time,
				city: req.body.city,
				homeImg: req.body.homeImg,				
				description: req.body.description,
				availablePieces: req.body.availablePieces,
				creator: req.user._id,
				tenants: [],
			}

			const home = await req.dbServices.custom.create(custom)
			// await req.dbServices.user.addTrip(trip._id, req.user._id)

			res.redirect('/')
		} else {
			res.locals.errors = createErrorMsg(errors)

			res.render("create", req.body)
		}
	},
)

// DETAILS
router.get(
	"/details/:id",
	async (req, res) => {
		const custom = await req.dbServices.custom.getByIdPopulated(req.params.id);
		// const ownerData = await req.dbServices.user.getById(custom.creator)

		if (req.user) {
			custom.isOwn = custom.creator.equals(req.user._id);	
			custom.hasRented = custom.tenants.some(x => x._id.equals(req.user._id));	
		}	
		
		custom.hasTennants = custom.tenants.length > 0;
    
		custom.tenantsArr = custom.tenants.map(x => x.name).join(', ');
		custom.hasAvailable = custom.availablePieces > custom.tenants.length;
		
		custom.leftAvailable = custom.availablePieces - custom.tenants.length;
		// custom.hasRented = custom.tenants.some(x => x._id == req.user._id);

		res.render('details', custom);
	},
)

// DELETE
router.get(
	"/delete/:id",
	ownerOnly, async (req, res) => {
		await req.dbServices.custom.deleteById(req.params.id)
		res.redirect('/home')
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
	body('name')
		.escape()
		.trim()
		.isLength({ min: 6 })
		.withMessage('Name must be at least 6 symbols long.'),
	body('type')
		.escape()
		.trim()
		.exists({checkFalsy: true})	
		.withMessage("Type must exist!"),
	body('year')
		.isInt({ min: 1850, max: 2021 })
		.withMessage('Year must be from 1850 to 2021.'),
	body('city')
		.escape()
		.trim()
		.isLength({ min: 4 })
		.withMessage('City must be at least 4 symbols long.'),
	body('homeImg')		
		.isURL({ protocols: ["http", "https"] })
		.withMessage('Home Image must be a valid URL'),	
	body('availablePieces')
		.isInt({ min: 0, max: 10 })
		.withMessage('Available pieces must be from 0 to 10'),
	async (req, res) => {
		const errors = validationResult(req)

		if (errors.isEmpty()) {
			const updatedPlay = {
				name: req.body.name,
				type: req.body.type,
				year: req.body.year,
				time: req.body.time,
				city: req.body.city,
				homeImg: req.body.homeImg,				
				description: req.body.description,
				availablePieces: req.body.availablePieces,
			}
			await req.dbServices.custom.updateById(req.params.id, updatedPlay)

			res.redirect(`/home/details/${req.params.id}`)
		} else {
			res.locals.errors = createErrorMsg(errors)

			res.render("edit", req.body)
		}
	},
)

router.get('/join/:id', usersOnly, notOwnerOnly, async (req, res) => {
	const custom = await req.dbServices.custom.getById(req.params.id)
	custom.tenants.push(req.user._id)

	await req.dbServices.custom.updateById(req.params.id, custom)

	res.redirect(`/home/details/${req.params.id}`)
})

router.get('/search', async (req, res) => {
	const matched = await req.dbServices.custom.filterByWord(req.query.search)

	res.render('search',{ matched })

});



module.exports = router
