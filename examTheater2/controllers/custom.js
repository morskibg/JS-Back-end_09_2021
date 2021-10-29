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
// //for testing !
// router.post('/create', usersOnly, (req, res) => {
//   console.log(req.body);
//   res.render('create');
// });
router.post(
  '/create',
  usersOnly,
  body('title')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Title must exist!')
    .custom((value, { req }) => req.customValidators.isTitleUnique(value, req))
    .withMessage('Title must be unique !'),
  body('description')
    .isLength({ max: 50 })
    .withMessage('Description must be max 50 symbols')
    .exists({ checkFalsy: true })
    .withMessage('Description must exist!'),
  body('imageUrl')
    .exists({ checkFalsy: true })
    .withMessage('Image must exist!'),
  body('imageUrl')
    .isLength({ min: 4 })
    .withMessage('Car brand must be at least 4 symbols'),

  async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const custom = {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        isPublic: req.body.isPublic ? true : false,
        createdAt: Date.now(),
        creator: req.user._id,
        likers: [],
      };

      // res.redirect('/');

      // adding to catch validation errors in db creation models
      try {
        const play = await req.dbServices.custom.create(custom);

        res.redirect('/');
      } catch (error) {
        res.locals.errors = error.message;
        res.render('booking pages/create', req.body);
      }
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
    'likers'
  );

  if (req.user) {
    custom.isOwn = custom.creator.equals(req.user._id);
    custom.alreadyLiked = custom.likers.some(x => x._id.equals(req.user._id));
  }

  res.render('details', custom);
});

// DELETE
router.get('/delete/:id', ownerOnly, async (req, res) => {
  await req.dbServices.custom.deleteById(req.params.id);
  res.redirect('/custom');
});

// EDIT
router.get('/edit/:id', ownerOnly, async (req, res) => {
  const play = await req.dbServices.custom.getById(req.params.id);
  res.render('edit', play);
});
router.post(
  '/edit/:id',
  ownerOnly,
  body('title')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Title must exist!'),
  body('description')
    .isLength({ max: 50 })
    .withMessage('Description must be max 50 symbols')
    .exists({ checkFalsy: true })
    .withMessage('Description must exist!'),
  body('imageUrl')
    .exists({ checkFalsy: true })
    .withMessage('Image must exist!'),
  body('imageUrl')
    .isLength({ min: 4 })
    .withMessage('Car brand must be at least 4 symbols'),
  async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const updatedPlay = {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        isPublic: req.body.isPublic ? true : false,
        createdAt: Date.now(),
      };
      await req.dbServices.custom.updateById(req.params.id, updatedPlay);

      res.redirect(`/custom/details/${req.params.id}`);
    } else {
      res.locals.errors = createErrorMsg(errors);

      res.render('edit', req.body);
    }
  }
);

router.get(
  '/like/:id',
  usersOnly,
  notOwnerOnly,
  notInvolvedOnly,
  async (req, res) => {
    const custom = await req.dbServices.custom.getById(req.params.id);
    custom.likers.push(req.user._id);

    await req.dbServices.custom.updateById(req.params.id, custom);

    res.redirect(`/custom/details/${req.params.id}`);
  }
);

module.exports = router;
