const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const router = require("express").Router()
const { TOKEN_SECRET, COOKIE_NAME } = require("../config/variables.js")
const { guestsOnly, usersOnly } = require("../middlewares/routeGuards.js")
const { body, validationResult } = require("express-validator")
const { createErrorMsg , createToken} = require("../helpers/helper")

const register = async (req, res, next) => {
	const errors = validationResult(req)

	if (errors.isEmpty()) {
		const hashedPassword = await bcrypt.hash(req.body.password, 8)

		const isExsiting = await req.dbServices.user.getByUsername(req.body.username)

		if (isExsiting === null) {
			const newUser = {
				username: req.body.username,				
				courses: [],
				hashedPassword,
			}
			try {
				await req.dbServices.user.createNew(newUser)
				next()				
			} catch (error) {
				res.locals.errors = createErrorMsg(error);
		    res.render('register', req.body);
			}				
		} else {
			res.locals.errors = 'Existing user!'

			res.render("login", req.body)
		}
	} else {
		res.locals.errors = createErrorMsg(errors)

		res.render("register", req.body)
	}
}

const login = async (req, res) => {
	const errors = validationResult(req)

	if (errors.isEmpty()) {
		const user = await req.dbServices.user.getByUsername(req.body.username)
		// add if no midleware for no existin user !!!!!
		// if(!user){
		// 	res.locals.errors = 'Invalid username or password!'
		// 	res.render('user pages/login', req.body)    /// <<<--- view is inside dir !!!!
		// }

		if (await bcrypt.compare(req.body.password, user.hashedPassword)) {
			createToken({ _id: user._id,username: user.username })
				.then((token) => {
					res.cookie(COOKIE_NAME, token, { httpOnly: true });
					res.redirect("/");
				})
				.catch((err) =>{
					res.locals.errors = err;
					res.render("login", req.body);
				} )

			// sync token creation
			// const token = jwt.sign(
			// 	{
			// 		_id: user._id,
			// 		username: user.username,
			// 	},
			// 	TOKEN_SECRET,
			// )
			// res.cookie(COOKIE_NAME, token, { httpOnly: true })
			// res.redirect("/")
		} else {
			res.locals.errors = 'Invalid username or password!'

			res.render('login', req.body)
		}
	} else {
		res.locals.errors = createErrorMsg(errors)

		res.render("login", req.body)
	}
}

//Register route
router.get("/register", guestsOnly, (req, res) => res.render("register"))
router.post(
	"/register",
	guestsOnly,
	body('username')		
		.escape()
		.trim()
		.exists({checkFalsy: true})
		.withMessage('Username must exist!')
		.isLength({ min: 3 })
		.withMessage('Username must be at least 3 symbols!')
		.custom((value, { req }) => req.customValidators.isRegisteredUser(value, req))
		.withMessage("Existing username !")
		.isAlphanumeric()
		.withMessage('Username must contain only english letters and digits !'),
	body("password")
		.isLength({ min: 3 })
		.withMessage('Password must be at least 3 symbols!')
		.matches(/[A-Za-z0-9.@]/)
		.withMessage('Password must contain only english letters and digits !')
		.custom((value, { req }) => req.customValidators.doPasswordsMatch(value, req))
		.withMessage("Passwords do not match!"),
	register,
	login,
)

// Login route
router.get("/login", guestsOnly, (req, res) => res.render("login"))
router.post("/login",
	guestsOnly,
	body('username')		
		.escape()
		.trim()
		.exists({checkFalsy: true}),
	body("password")
		.escape()
		.trim()
		.exists({checkFalsy: true})	
		.withMessage("Password must exist!"),
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

	res.render('profile', populatedUser)
})

module.exports = router
