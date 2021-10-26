const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const router = require("express").Router()
const { TOKEN_SECRET, COOKIE_NAME } = require("../config/variables.js")
const { guestsOnly, usersOnly } = require("../middlewares/routeGuards.js")
const { body, validationResult } = require("express-validator")
const { createErrorMsg, createErrorFromModel } = require("../helpers/helper")

const register = async (req, res, next) => {
	const errors = validationResult(req)

	if (errors.isEmpty()) {
		const hashedPassword = await bcrypt.hash(req.body.password, 8)

		const isExsiting = await req.dbServices.user.getByUsername(req.body.username)

		if (isExsiting === null) {
			const newUser = {
				hashedPassword,
				email: req.body.email,
				username: req.body.username,			
				bookedHotels: [],
				offeredHotels: [],
			}
			try {
				await req.dbServices.user.createNew(newUser)
				next()				
			} catch (error) {
				res.locals.errors = createErrorMsg(error);
		    res.render('user pages/register', req.body);
			}

		} else {
			res.locals.errors = 'Existing user!'

			res.render("user pages/register", req.body)
		}
	} else {
    // console.log("🚀 ~ file: user.js ~ line 40 ~ register ~ errors", errors)
		res.locals.errors = createErrorMsg(errors)

		res.render("user pages/register", req.body)
	}
}

const login = async (req, res) => {
	const errors = validationResult(req)

	if (errors.isEmpty()) {
		const user = await req.dbServices.user.getByUsername(req.body.username)

		// if(!user){
		// 	res.locals.errors = 'Invalid username or password!'
		// 	res.render('user pages/login', req.body)
		// }

		if (await bcrypt.compare(req.body.password, user.hashedPassword)) {
			const token = jwt.sign(
				{
					_id: user._id,
					username: user.username,
				},
				TOKEN_SECRET,
			)
			res.cookie(COOKIE_NAME, token, { httpOnly: true })
			res.redirect("/")
		} else {
			res.locals.errors = 'Invalid username or password!'

			res.render('user pages/login', req.body)
		}
	} else {
		res.locals.errors = createErrorMsg(errors)

		res.render("user pages/login", req.body)
	}
}

//Register route
router.get("/register", guestsOnly, (req, res) => res.render("user pages/register"))
router.post(
	"/register",
	guestsOnly,
	body('email')
		.isEmail()
		.withMessage('Must be a valid Email')
		.custom((value, { req }) => req.customValidators.isEmailTaken(value, req))
		.withMessage("Email already taken !!! ")
		.custom((value, { req }) => req.customValidators.isValidEmail(value, req))
		.withMessage("Email is gaden !!! "),
	body('username')		
		.escape()
		.trim()
		.exists({checkFalsy: true})
		.withMessage("Username must exist")
		.custom((value, { req }) => req.customValidators.isUsernameTaken(value, req))
		.withMessage("Username already taken !!! "),		
	body("password")
		.isLength({ min: 5 })
		.withMessage('Password must be at least 5 symbols!')
		.isAlphanumeric()
		.withMessage('Password must consist only english letters and digits !')
		.custom((value, { req }) => req.customValidators.doPasswordsMatch(value, req))
		.withMessage("Passwords do not match!"),
	register,
	login,
)

// Login route
router.get("/login", guestsOnly, (req, res) => res.render("user pages/login"))
router.post("/login",
	guestsOnly,
	body('username')		
		.escape()
		.trim()
		.exists({checkFalsy: true})
		.custom((value, { req }) => req.customValidators.isRegisteredUser(value, req))
		.withMessage("Invalid username or password !"),
	body("password")
		.isLength({ min: 5 })
		.withMessage('Password must be at least 5 symbols!')
		.isAlphanumeric()
		.withMessage('Password must consist only english letters and digits !'),
	login,
)

// Logout route
router.get(
	"/logout",
	usersOnly, (req, res) => {
		
		res.clearCookie(COOKIE_NAME)
		res.redirect("/")
	},
)

router.get('/profile', usersOnly, async (req, res) => {
	const populatedUser = await req.dbServices.user.getById(req.user._id)
	const hotels = populatedUser.bookedHotels.map(x=>x.name).join(', ')
	res.render('user pages/profile', {...populatedUser, hotelsArr: hotels})
})

module.exports = router
