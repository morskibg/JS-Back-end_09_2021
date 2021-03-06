const router = require("express").Router()
const { usersOnly, ownerOnly, notOwnerOnly } = require("../middlewares/routeGuards")
const { body, validationResult } = require("express-validator")
const custom = require("../db/services/custom")
const { createErrorMsg } = require("../helpers/helper")

// router.get('/', async (req, res) => {
// 	const customs = await req.dbServices.custom.getAll()

// 	res.render('custom', { customs })
// })

// CREATE
router.get("/create", usersOnly, (req, res) => res.render("booking pages/create"))
router.post(
	"/create",
	usersOnly,
	body('name')
		.escape()
		.trim()
		.isLength({ min: 4 })
		.withMessage('Name must be at least 4 symbols!')
		.exists({checkFalsy: true}),
	body('city')
		.isLength({ min: 4 })
		.withMessage('City must be at least 4 symbols long.'),	
	body('imageUrl')
		.isURL({ protocols: ["http", "https"] })
		.withMessage('Hotel Image must be a valid URL'),
	body('freeRooms')
		.isInt({ min: 1, max: 100 })
		.withMessage('Rooms must be from 1 to 100'),
	async (req, res) => {
		const errors = validationResult(req)

		if (errors.isEmpty()) {
			const custom = {
				name: req.body.name,
				city: req.body.city,
				imageUrl: req.body.imageUrl,				
				freeRooms: req.body.freeRooms,
				owner: req.user._id,				
				bookers: [],
			}
      
			try {
				const hotel = await req.dbServices.custom.create(custom);				
				await req.dbServices.user.addHotel(hotel._id, req.user._id);	
				res.redirect('/');
			} catch (error) {
				res.locals.errors = error.message;
		    res.render('booking pages/create', req.body);
			}
		} else {
			res.locals.errors = createErrorMsg(errors);
			res.render("booking pages/create", req.body)
		}
	},
)

// DETAILS
router.get(
	"/details/:id", usersOnly,
	async (req, res) => {
		const custom = await req.dbServices.custom.getByIdPopulated(req.params.id)
		const owner = await req.dbServices.user.getById(custom.owner)

		if (req.user) {
			custom.isOwn = custom.owner.equals(req.user._id)
			custom.alreadyBooked = custom.bookers.some(x => x._id.equals(req.user._id))
			custom.calcFreeRooms =
				custom.freeRooms - custom.bookers.length > 0
					? custom.freeRooms - custom.bookers.length
					: false
		}

		custom.owner = owner.username
		custom.bookersArr = custom.bookers.map(x => x.email).join(', ')

		res.render('booking pages/details', custom)
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
		const custom = await req.dbServices.custom.getById(req.params.id)
		custom.calcFreeRooms = custom.freeRooms - custom.bookers.length
		res.render("booking pages/edit", custom)
	},
)
router.post(
	"/edit/:id",
	ownerOnly,
	body('name')
		.escape()
		.trim()
		.isLength({ min: 4 })
		.withMessage('Name must be at least 4 symbols!')
		.exists({checkFalsy: true}),
	body('city')
		.isLength({ min: 4 })
		.withMessage('City must be at least 4 symbols long.'),	
	body('imageUrl')
		.isURL({ protocols: ["http", "https"] })
		.withMessage('Hotel Image must be a valid URL'),
	body('freeRooms')
		.isInt({ min: 1, max: 100 })
		.withMessage('Rooms must be from 1 to 100'),
	async (req, res) => {
		const errors = validationResult(req)

		if (errors.isEmpty()) {
			const updatedPlay = {
				name: req.body.name,
				city: req.body.city,
				imageUrl: req.body.imageUrl,				
				freeRooms: req.body.freeRooms,
			}
			await req.dbServices.custom.updateById(req.params.id, updatedPlay)

			res.redirect(`/custom/details/${req.params.id}`)
		} else {
			res.locals.errors = createErrorMsg(errors)

			res.render("/", req.body)
		}
	},
)

router.get('/book/:id', usersOnly, notOwnerOnly, async (req, res) => {
	const custom = await req.dbServices.custom.getById(req.params.id);
	const user = await req.dbServices.user.getById(req.user._id);
	const calcFreeRomms = custom.freeRooms - custom.bookers.length;
	if(calcFreeRomms === 0){
		res.redirect(`/custom/details/${req.params.id}`)
	}
	custom.bookers.push(req.user._id);
	user.bookedHotels.push(req.params.id);		
	try {
		await req.dbServices.custom.updateById(req.params.id, custom);
		await req.dbServices.user.addBooked(custom._id, req.user._id);
		res.redirect(`/custom/details/${req.params.id}`)
	} catch (error) {
		res.locals.errors = error.message;
		res.render('booking pages/details', req.body);
	}	
})

module.exports = router
