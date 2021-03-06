const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');

const router = require('express').Router();
const { TOKEN_SECRET, COOKIE_NAME } = require('../config/variables.js');
const { guestsOnly, usersOnly } = require('../middlewares/routeGuards.js');
const { body, validationResult } = require('express-validator');
const { createErrorMsg } = require('../helpers/helper');

const jwt_sign = util.promisify(jwt.sign);

const register = async (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const hashedPassword = await bcrypt.hash(req.body.password, 8);

    const isExsiting = await req.dbServices.user.getByUsername(req.body.email);

    if (isExsiting === null) {
      const newUser = {
        name: req.body.name,
        username: req.body.username,
        hashedPassword,
      };

      try {
        await req.dbServices.user.createNew(newUser);
        next();
      } catch (error) {
        res.locals.errors = createErrorMsg(error);
        res.render('user pages/register', req.body);
      }

      // next()
    } else {
      res.locals.errors = 'Existing user!';

      res.render('register', req.body);
    }
  } else {
    res.locals.errors = createErrorMsg(errors);

    res.render('register', req.body);
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const user = await req.dbServices.user.getByUsername(req.body.username); // LOOOOK HEREEEE !!!!!!!!
    // add if no midleware for no existin user !!!!!
    if (!user) {
      res.locals.errors = 'Invalid username or password!';
      res.render('login', req.body); /// <<<--- view is inside dir !!!!
    }

    if (await bcrypt.compare(req.body.password, user.hashedPassword)) {
      //// sync version of token creation
      // const token = jwt.sign(
      //   {
      //     _id: user._id,
      //     email: user.email,
      //   },
      //   TOKEN_SECRET
      // );
      try {
        const token = await jwt_sign(
          {
            _id: user._id,
            username: user.username,
          },
          TOKEN_SECRET
        );
        res.cookie(COOKIE_NAME, token, { httpOnly: true });
        res.redirect('/');
      } catch (error) {
        console.log('???? ~ file: user.js ~ line 74 ~ login ~ error', error);
        res.locals.errors = 'Login Error !';
        res.render('login', req.body);
      }
      //// uncoment for sync token creation
      // res.cookie(COOKIE_NAME, token, { httpOnly: true });
      // res.redirect('/');
    } else {
      res.locals.errors = 'Invalid email or password!';

      res.render('login', req.body);
    }
  } else {
    res.locals.errors = createErrorMsg(errors);

    res.render('login', req.body);
  }
};

//Register route
router.get('/register', guestsOnly, (req, res) => res.render('register'));
router.post(
  '/register',
  guestsOnly,
  body('name')
    .custom((value, { req }) => req.customValidators.isValidName(value, req))
    .withMessage('Name must be in format <firstName lastName>!'),
  body('username')
    .isLength({ min: 5 })
    .withMessage('Usrname must be at least 5 symbols!')
    .custom((value, { req }) =>
      req.customValidators.isUsernameTaken(value, req)
    )
    .withMessage('This username is already taken!'),
  body('password')
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 symbols!')
    .custom((value, { req }) =>
      req.customValidators.doPasswordsMatch(value, req)
    )
    .withMessage('Passwords do not match!'),
  register,
  login
);

// Login route
router.get('/login', guestsOnly, (req, res) => res.render('login'));
router.post(
  '/login',
  guestsOnly,
  body('username'),
  body('password')
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 symbols!'),
  login
);

//// validator for unique user reg prop - !!!!!
// .escape()
// .trim()
// .exists({ checkFalsy: true })
// .withMessage('Username must exist!')
// .custom((value, { req }) =>
//   req.customValidators.isUsernameTaken(value, req)
// )
// .withMessage('Username already taken!'),

// Logout route
router.get('/logout', usersOnly, (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.redirect('/');
});

router.get('/profile', usersOnly, async (req, res) => {
  const populatedUser = await req.dbServices.user.getById(req.user._id);

  res.render('profile', populatedUser);
});

module.exports = router;
