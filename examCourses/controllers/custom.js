const router = require('express').Router();
const {
  usersOnly,
  ownerOnly,
  notOwnerOnly,
  notInvolvedOnly,
} = require('../middlewares/routeGuards');
const { body, validationResult } = require('express-validator');
const custom = require('../db/services/custom');
const { createErrorMsg } = require('../helpers/helper');

router.get('/', async (req, res) => {
  const customs = await req.dbServices.custom.getAll();

  res.render('custom', { customs });
});

// usersOnly,
// 	body('name')
// 		.escape()
// 		.trim()
// 		.isLength({ min: 6 })
// 		.withMessage('Name must be at least 6 symbols long.'),
// 	body('type')
// 		.escape()
// 		.trim()
// 		.exists({checkFalsy: true})
// 		.withMessage("Type must exist!"),
// 	body('year')
// 		.isInt({ min: 1850, max: 2021 })
// 		.withMessage('Year must be from 1850 to 2021.'),
// 	body('city')
// 		.escape()
// 		.trim()
// 		.isLength({ min: 4 })
// 		.withMessage('City must be at least 4 symbols long.'),
// 	body('homeImg')
// 		.isURL({ protocols: ["http", "https"] })
// 		.withMessage('Home Image must be a valid URL'),
// 	body('availablePieces')
// 		.isInt({ min: 0, max: 10 })
// 		.withMessage('Available pieces must be from 0 to 10'),

// CREATE
router.get('/create', usersOnly, (req, res) => res.render('create'));

router.post(
  '/create',
  usersOnly,
  body('title')
    .escape()
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Title must exist!')
    .isLength({ min: 4 })
    .withMessage('Title must be at least 4 symbols long.'),
  body('description')
    .exists({ checkFalsy: true })
    .withMessage('Desceiption must exist!')
    .isLength({ min: 20 })
    .withMessage('Description. must be at least 20 symbols'),
  body('courseImage')
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Course Image must be a valid URL'),
  async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const custom = {
        title: req.body.title,
        description: req.body.description,
        courseImage: req.body.courseImage,
        isPublic: req.body.isPublic ? true : false,
        createdAt: Date.now(),
        creator: req.user._id,
        students: [],
      };
      try {
        const course = await req.dbServices.custom.create(custom);
        res.redirect('/');
      } catch (error) {
        res.locals.errors = error.message;

        res.render('create', req.body);
      }

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
      res.locals.errors = createErrorMsg(errors);

      res.render('create', req.body);
    }
  }
);

// DETAILS
// added guard for users only !!!!!!
router.get('/details/:id', usersOnly, async (req, res) => {
  const custom = await req.dbServices.custom.getByIdPopulatedMod(
    req.params.id,
    'students'
  );
  // const user = await req.dbServices.user.getById(custom.creator);

  if (req.user) {
    custom.isOwn = custom.creator.equals(req.user._id);
    custom.alreadyJoined = custom.students.some(x =>
      x._id.equals(req.user._id)
    );
  }
  res.render('details', custom);
});

// DELETE
router.get('/delete/:id', ownerOnly, async (req, res) => {
  await req.dbServices.custom.deleteById(req.params.id);
  res.redirect('/');
});

// EDIT
router.get('/edit/:id', ownerOnly, async (req, res) => {
  const course = await req.dbServices.custom.getById(req.params.id);

  console.log('🚀 ~ file: custom.js ~ line 131 ~ router.get ~ course', course);
  res.render('edit', course);
});
router.post(
  '/edit/:id',
  ownerOnly,
  body('title')
    .escape()
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Title must exist!')
    .isLength({ min: 4 })
    .withMessage('Title must be at least 4 symbols long.'),
  body('description')
    .exists({ checkFalsy: true })
    .withMessage('Desceiption must exist!')
    .isLength({ min: 20 })
    .withMessage('Description. must be at least 20 symbols'),
  body('courseImage')
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Course Image must be a valid URL'),
  async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const updatedCourse = {
        title: req.body.title,
        description: req.body.description,
        courseImage: req.body.courseImage,
        isPublic: req.body.isPublic ? true : false,
        createdAt: Date.now(),
      };
      await req.dbServices.custom.updateById(req.params.id, updatedCourse);

      res.redirect(`/custom/details/${req.params.id}`);
    } else {
      res.locals.errors = createErrorMsg(errors);

      res.render('edit', req.body);
    }
  }
);

router.get(
  '/enroll/:id',
  usersOnly,
  notOwnerOnly,
  notInvolvedOnly,
  async (req, res) => {
    const custom = await req.dbServices.custom.getById(req.params.id);
    custom.students.push(req.user._id);

    await req.dbServices.custom.updateById(req.params.id, custom);
    await req.dbServices.user.addCourse(req.params.id, req.user._id);

    res.redirect(`/custom/details/${req.params.id}`);
  }
);

module.exports = router;
