const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const router = require("express").Router()
const { TOKEN_SECRET, COOKIE_NAME } = require("../config/variables.js")
const { guestsOnly, usersOnly, ownerOnly } = require("../middlewares/routeGuards.js")
const { body, validationResult } = require("express-validator")
const { createErrorMsg } = require('../helpers/helper')
const { trips } = require("../db/services/user.js")

const register = async (req, res, next) => {
	const errors = validationResult(req)

	if (errors.isEmpty()) {
		const hashedPassword = await bcrypt.hash(req.body.password, 8)

		const newUser = {
			email: req.body.email,
			password: hashedPassword,
			gender: req.body.gender
		}

		await req.dbServices.user.createNew(newUser)

		next()
	} else {
		res.locals.errors = createErrorMsg(errors)

		res.render("register", req.body)
	}
}

const login = async (req, res) => {
	const errors = validationResult(req)

	if (errors.isEmpty()) {
		try {
			const user = await req.dbServices.user.getByEmail(req.body.email)
			if (!user) throw new Error('Wrong user or password ! <br />');
			const isCorrectPassword = await bcrypt.compare(req.body.password, user.password);
			if (!isCorrectPassword) throw new Error('Wrong user or password ! <br />');
			
			const token = jwt.sign(
				{
					_id: user._id,
					email: user.email,
				},
				TOKEN_SECRET,
			)
			res.cookie(COOKIE_NAME, token, { httpOnly: true })
			res.redirect("/")
			
		} catch (error) {
			res.locals.errors = error;
			res.render("login", req.body)
		}
		
	} else {
		res.locals.errors = createErrorMsg(errors)

		res.render("login", req.body)
	}
}

//Register route
router.get("/register", guestsOnly, (req, res) => res.render("register"))
router.post("/register",
	guestsOnly,
	body('email')
		.isEmail()
		.withMessage('Email must be only english letters and digits')
		.normalizeEmail()
		.withMessage('Email was normalized !'),
	body('password')
		.isLength({ min: 4 })
		.withMessage('Password must be at least 4 symbols')
		.custom((value, { req }) => req.customValidators.doPasswordsMatch(value, req))
		.withMessage('Passwords do not match!'),
	register,
	login,
) // VALIDATORS, AFTER GUEST ONLY

// Login route
router.get("/login", guestsOnly, (req, res) => res.render("login"))
router.post("/login", guestsOnly, login) // VALIDATORS, AFTER GUEST ONLY

// Logout route
router.get("/logout", usersOnly, (req, res) => {
	res.clearCookie(COOKIE_NAME)
	res.redirect("/")
})

//profile
router.get('/profile', async (req, res) => {
	const user = await req.dbServices.user.getByIdPopulated(req.user._id);
	const trips = await req.dbServices.user.trips(req.user._id);
	const context = {
		trips,
		tripsCount: trips.length,
		isMale: user.gender === 'male' ,
		user		
	}

	res.render('profile', context)
})

module.exports = router
