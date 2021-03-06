const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const router = require("express").Router()
const { TOKEN_SECRET, COOKIE_NAME } = require("../config/variables.js")
const { guestsOnly, usersOnly } = require("../middlewares/routeGuards.js")
const { body, validationResult } = require("express-validator")
const { createErrorMsg } = require("../helpers/helper")

const register = async (req, res, next) => {
	const errors = validationResult(req);

	if (errors.isEmpty()) {
		const hashedPassword = await bcrypt.hash(req.body.password, 8);

		const isExsiting = await req.dbServices.user.getByUsername(req.body.username);

		if (isExsiting === null) {
			const newUser = {
				name: req.body.name,
				username: req.body.username,
				password: hashedPassword
			};

			await req.dbServices.user.createNew(newUser);

			next();
		} else {
			res.locals.errors = 'Existing user!';

			res.render("login", req.body);
		}
	} else {
		res.locals.errors = createErrorMsg(errors);

		res.render("register", req.body);
	}
}

const login = async (req, res) => {
	const errors = validationResult(req);

	if (errors.isEmpty()) {
		const user = await req.dbServices.user.getByUsername(req.body.username);

		if (await bcrypt.compare(req.body.password, user.password)) {
			const token = jwt.sign(
				{
					_id: user._id,
					name: user.name,
					username: user.username,
				},
				TOKEN_SECRET,
			);
			res.cookie(COOKIE_NAME, token, { httpOnly: true });
			res.redirect("/");
		} else {
			res.locals.errors = 'Invalid username or password!';

			res.render('login', req.body);
		}
	} else {
		res.locals.errors = createErrorMsg(errors);

		res.render("login", req.body);
	}
}

//Register route
router.get("/register", guestsOnly, (req, res) => res.render("register"))
router.post(
	"/register",
	guestsOnly,
	body('name')
		.escape()
		.trim()
		.exists({checkFalsy: true})	
		.withMessage("Name must exist!")
		.matches(/^[A-Za-z]+[ ]{1}[A-Za-z]+$/)
		.withMessage("Name format must be firstName lastName !"),
	body('username')
		.escape()
		.trim()
		.exists({checkFalsy: true})	
		.withMessage("Username must exist!")
		.isLength({ min: 5 })
		.withMessage("Username must be at least 5 symbols!"),
	body("password")
		.isLength({ min: 4 })
		.withMessage('Password must be at least 4 symbols!')
		.custom((value, { req }) => req.customValidators.doPasswordsMatch(value, req))
		.withMessage("Passwords do not match!"),
	register,
	login,
)

// Login route
router.get("/login", guestsOnly, (req, res) => res.render("login"));
router.post("/login",
	guestsOnly,
	body('username')
		.escape()
		.trim()
		.exists({checkFalsy: true})	
		.withMessage("Username must exist!")
		.isLength({ min: 5 })
		.withMessage("Username must be at least 5 symbols!"),
	body("password")
		.isLength({ min: 4 })
		.withMessage('Password must be at least 4 symbols!'),
	login,
);

// Logout route
router.get(
	"/logout",
	usersOnly, (req, res) => {
		res.clearCookie(COOKIE_NAME)
		res.redirect("/")
	},
);

router.get('/profile', usersOnly, async (req, res) => {
	const populatedUser = await req.dbServices.user.getById(req.user._id)

	res.render('profile', populatedUser)
})

module.exports = router
