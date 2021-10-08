const router = require("express").Router()
const { usersOnly, ownerOnly, notOwnerOnly } = require("../middlewares/routeGuards")
const { body, validationResult } = require("express-validator")
const custom = require("../db/services/custom")
const { createErrorMsg } = require("../helpers/helper")

router.get("/", async (req, res) => {
	const allTrips = await req.dbServices.custom.getAll() 
	res.render("shared-trips", { allTrips })}
);

router.get("/create", usersOnly, (req, res) => res.render("trip-create"));
router.post(
	"/create",
	usersOnly,
	body('startPoint')
		.isLength({ min: 4 })
		.withMessage('Starting Point must not be empty and must have at least 4 characters !'),
	body('endPoint')
		.isLength({ min: 4 })
		.withMessage('End Point must not be empty and must have at least 4 characters !'),
	body('date')
		.isLength({ min: 1 })
		.withMessage('Date can not be empty!'),
	body('time')
		.isLength({ min: 1 })
		.withMessage('Time can not be empty!'),
	body('carImage')
		.isLength({ min: 1 })
		.withMessage('Image can not be empty!'),
	body('carBrand')
		.isLength({ min: 1 })
		.withMessage('Brand can not be empty!'),
	body('seats')
		.isInt({min: 0, max: 4})
		.withMessage('Seats must be number between 0 and 4 (incl)'),
	body('price')
		.isInt({min: 1, max: 50})
		.withMessage('Price must be number between 1 and 50 (incl)'),
	body('description')
		.isLength({ min: 1 })
		.withMessage('Description must not be empty'),
async (req, res) => {
	const errors = validationResult(req)

	if (errors.isEmpty()) {
		const custom = {
			startPoint: req.body.startPoint,
			endPoint: req.body.endPoint,
			date: req.body.date,
			time: req.body.time,
			carImage: req.body.carImage,
			carBrand: req.body.carBrand,
			seats: req.body.seats,
			price: req.body.price,			
			description: req.body.description,
			creator: req.user._id,			
			buddies: [],
		}
		await req.dbServices.custom.create(custom)
		res.redirect('/')
	} else {
		res.locals.errors = createErrorMsg(errors)
    // console.log("🚀 ~ file: custom.js ~ line 64 ~ errors", errors)
		
		res.render("trip-create", custom)
	}
},
)

router.get("/:id", async (req, res) => {
	const selectedTrip = await req.dbServices.custom.getByIdPopulated(req.params.id);
	let isCreator = false;
	let canJoin = false;
	let isJoined = false;
	let availableSeats = selectedTrip.seats - selectedTrip.buddies.length;
	let buddiesStr = selectedTrip.buddies.map(x=>x.email).join(', ');
	
	if(req.user){
		console.log('in loged USER');
		isCreator = String(selectedTrip.creator._id) === String(req.user._id);    
		isJoined = selectedTrip.buddies.some( x => String(x._id) === String(req.user._id));    
		canJoin = !isJoined && String(selectedTrip.creator._id) !==  String(req.user._id) &&
			availableSeats > 0
	}
	// console.log("🚀 ~ file: custom.js ~ line 80 ~ router.get ~ isCreator", isCreator)
	// console.log("🚀 ~ file: custom.js ~ line 84 ~ router.get ~ req.user._id", req.user._id)
	// console.log("🚀 ~ file: custom.js ~ line 85 ~ router.get ~ selectedTrip.buddies", selectedTrip.buddies)
	// console.log("🚀 ~ file: custom.js ~ line 82 ~ router.get ~ isJoined", isJoined)
	// console.log("🚀 ~ file: custom.js ~ line 83 ~ router.get ~ canJoin", canJoin)
	// console.log("🚀 ~ file: custom.js ~ line 77 ~ router.get ~ availableSeats", availableSeats)
	
  const payload = {...selectedTrip, 
		isCreator,
		isJoined,
		canJoin,
		availableSeats,
		buddiesStr
	};
	res.render("trip-details", payload); 
});

router.get("/:id/delete", usersOnly, ownerOnly, async (req, res) => {
	await req.dbServices.custom.deleteById(req.params.id);
	res.redirect('/custom')
});

router.get("/:id/edit", usersOnly, ownerOnly, async (req, res) => {
	const selectedTrip = await req.dbServices.custom.getByIdPopulated(req.params.id);
	
	res.render('trip-edit', selectedTrip)
});

router.post("/:id/edit", usersOnly, ownerOnly, async (req, res) => {
	// const selectedTrip = await req.dbServices.custom.getByIdPopulated(req.params.id);
	const updatedTrip = {
		startPoint: req.body.startPoint,
		endPoint: req.body.endPoint,
		date: req.body.date,
		time: req.body.time,
		carImage: req.body.carImage,
		carBrand: req.body.carBrand,
		seats: req.body.seats,
		price: req.body.price,			
		description: req.body.description,	};
	
	try {
		await req.dbServices.custom.updateById(req.params.id, updatedTrip);	
		res.redirect(`/custom/${req.params.id}`);	
	} catch (error) {
    console.log("🚀 ~ file: custom.js ~ line 129 ~ router.post ~ error", error)
		res.locals.errors = error;
		res.render("trip-edit", req.body)
	}	
});

router.get("/:id/join", usersOnly, notOwnerOnly, async (req, res) => {
	
	await req.dbServices.custom.join(req.params.id, req.user);
	res.redirect(`/custom/${req.params.id}`);
});

// // DETAILS
// router.get(
// 	"/details/:id", usersOnly, async (req, res) => {
// 		const custom = await req.dbServices.custom.getById(req.params.id)

// 		custom.isOwn = custom.owner.equals(req.user._id)
// 		custom.alreadyBought = custom.buyers.some(x => x.equals(req.user._id))

// 		res.render('details', custom)
// 	},
// )

// // DELETE
// router.get("/delete/:id", ownerOnly, async (req, res) => {
// 	await req.dbServices.custom.deleteById(req.params.id)
// 	res.redirect('/')
// })

// // EDIT
// router.get(
// 	"/edit/:id", ownerOnly, async (req, res) => {
// 		const play = await req.dbServices.custom.getById(req.params.id)

// 		res.render("edit", play)
// 	},
// )
// router.post(
// 	"/edit/:id", ownerOnly, async (req, res) => {
// 		const updatedPlay = {
// 			name: req.body.name,
// 			price: req.body.price,
// 			description: req.body.description,
// 			imageUrl: req.body.imageUrl,
// 			brand: req.body.brand,
// 		}
// 		await req.dbServices.custom.updateById(req.params.id, updatedPlay)

// 		res.redirect(`/custom/details/${req.params.id}`)
// 	},
// )

// router.get('/buy/:id', notOwnerOnly, async (req, res) => {
// 	await req.dbServices.custom.buy(req.user._id, req.params.id)
// 	await req.dbServices.user.buy(req.user._id, req.params.id)

// 	res.redirect(`/custom/details/${req.params.id}`)
// })

module.exports = router