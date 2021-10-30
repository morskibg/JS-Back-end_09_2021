const router = require('express').Router();
const {
  usersOnly,
  ownerOnly,
  notOwnerOnly,
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
//for testing !
// router.post('/create', usersOnly, (req, res) => {
//   console.log(req.body);
//   res.render('create');
// });
router.post(
  '/create',
  usersOnly,
  body('merchant')
    .isLength({ min: 4 })
    .withMessage('Merchant must be at least 4 symbols long.'),
  body('total').isFloat({ min: 0 }).withMessage('Total should be positive'),
  body('category')
    .custom((value, { req }) =>
      req.customValidators.isValidCategory(value, req)
    )
    .withMessage('Invalid category!'),
  body('description')
    .isLength({ min: 3, max: 30 })
    .withMessage('Description. must be between 3 and 30 symbols'),

  async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const custom = {
        merchant: req.body.merchant,
        total: req.body.total,
        category: req.body.category,
        description: req.body.description,
        report: req.body.report ? true : false,
        user: req.user._id,
        creator: req.user._id,
      };

      const expense = await req.dbServices.custom.create(custom);

      res.redirect('/');

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
  const custom = await req.dbServices.custom.getByIdPopulated(req.params.id);
  const driverData = await req.dbServices.user.getById(custom.creator);

  if (req.user) {
    custom.isOwn = custom.creator.equals(req.user._id);
    custom.alreadyJoined = custom.buddies.some(x => x._id.equals(req.user._id));
    custom.freeSeats =
      custom.seats - custom.buddies.length > 0
        ? custom.seats - custom.buddies.length
        : false;
  }

  custom.driver = driverData.email;
  custom.buddies = custom.buddies.map(x => x.email).join(', ');

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
  body('startPoint')
    .isLength({ min: 4 })
    .withMessage('Start Point must be at least 4 symbols long.'),
  body('endPoint')
    .isLength({ min: 4 })
    .withMessage('End Point must be at least 4 symbols long.'),
  body('seats')
    .isInt({ min: 0, max: 4 })
    .withMessage('Seats must be from 0 to 4'),
  body('description')
    .isLength({ min: 10 })
    .withMessage('Description. must be at least 10 symbols'),
  body('carImage')
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Car Image must be a valid URL'),
  body('carBrand')
    .isLength({ min: 4 })
    .withMessage('Car brand must be at least 4 symbols'),
  body('price')
    .isInt({ min: 1, max: 50 })
    .withMessage('Price must be from 1 to 50'),
  async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const updatedPlay = {
        startPoint: req.body.startPoint,
        endPoint: req.body.endPoint,
        date: req.body.date,
        time: req.body.time,
        carImage: req.body.carImage,
        carBrand: req.body.carBrand,
        seats: req.body.seats,
        price: req.body.price,
        description: req.body.description,
      };
      await req.dbServices.custom.updateById(req.params.id, updatedPlay);

      res.redirect(`/custom/details/${req.params.id}`);
    } else {
      res.locals.errors = createErrorMsg(errors);

      res.render('edit', req.body);
    }
  }
);

router.get('/join/:id', usersOnly, notOwnerOnly, async (req, res) => {
  const custom = await req.dbServices.custom.getById(req.params.id);
  custom.buddies.push(req.user._id);

  await req.dbServices.custom.updateById(req.params.id, custom);

  res.redirect(`/custom/details/${req.params.id}`);
});

module.exports = router;
