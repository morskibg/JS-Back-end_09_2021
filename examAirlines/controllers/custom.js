const router = require('express').Router();
const {
  usersOnly,
  ownerOnly,
  notOwnerOnly,
  adminOnly,
} = require('../middlewares/routeGuards');
const { body, validationResult } = require('express-validator');
const custom = require('../db/services/custom');
const { createErrorMsg } = require('../helpers/helper');
const dbServices = require('../middlewares/dbServices');

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
  adminOnly,
  body('destination')
    .isLength({ min: 4 })
    .withMessage('Destination must be at least 4 symbols long.'),
  body('origin')
    .isLength({ min: 4 })
    .withMessage('Origin must be at least 4 symbols long.'),
  body('date').exists({ checkFalsy: true }).withMessage('Date must exist'),
  body('time').exists({ checkFalsy: true }).withMessage('Time must exist'),
  body('image')
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Image must be a valid URL'),
  async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const custom = {
        destination: req.body.destination,
        origin: req.body.origin,
        date: req.body.date,
        time: req.body.time,
        image: req.body.image,
        creator: req.user._id,
        isPublic: false,
        bookers: [],
        seats: [],
      };

      const flight = await req.dbServices.custom.create(custom);
      await req.dbServices.user.addFlight(flight._id, req.user._id);

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
  const query = req.query.errors;
  if (query) {
    res.locals.errors = query;
  }
  const custom = await req.dbServices.custom.getByIdPopulatedMod(
    req.params.id,
    'seats'
  );

  res.render('details', custom);
});

// DELETE
router.get('/delete/:id', adminOnly, async (req, res) => {
  await req.dbServices.custom.deleteById(req.params.id);
  res.redirect('/custom');
});

// EDIT
router.get('/edit/:id', adminOnly, async (req, res) => {
  const flight = await req.dbServices.custom.getById(req.params.id);
  flight.date = flight.date.toISOString().split('T')[0];

  res.render('edit', flight);
});
router.post(
  '/edit/:id',
  adminOnly,
  body('destination')
    .isLength({ min: 4 })
    .withMessage('Destination must be at least 4 symbols long.'),
  body('origin')
    .isLength({ min: 4 })
    .withMessage('Origin must be at least 4 symbols long.'),
  body('date').exists({ checkFalsy: true }).withMessage('Date must exist'),
  body('time').exists({ checkFalsy: true }).withMessage('Time must exist'),
  body('image')
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Image must be a valid URL'),
  async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const updatedFlight = {
        destination: req.body.destination,
        origin: req.body.origin,
        date: req.body.date,
        time: req.body.time,
        image: req.body.image,
        isPublic: req.body.isPublic ? true : false,
      };
      await req.dbServices.custom.updateById(req.params.id, updatedFlight);

      res.redirect(`/custom/details/${req.params.id}`);
    } else {
      res.locals.errors = createErrorMsg(errors);

      res.render('edit', req.body);
    }
  }
);

router.get('/publish/:id', usersOnly, adminOnly, async (req, res) => {
  const custom = await req.dbServices.custom.getById(req.params.id);
  custom.isPublic = !custom.isPublic;

  await req.dbServices.custom.updateById(req.params.id, custom);

  res.redirect(`/custom/details/${req.params.id}`);
});

router.get('/:id/seats/:seat_id', usersOnly, adminOnly, async (req, res) => {
  const flight = await req.dbServices.custom.getByIdPopulatedMod(
    req.params.id,
    'seats'
  );
  flight.seats = flight.seats.filter(
    x => String(x._id) !== String(req.params.seat_id)
  );
  await req.dbServices.custom.updateById(req.params.id, flight);
  res.redirect(`/custom/details/${req.params.id}`);
});

router.post('/:id/seats', usersOnly, adminOnly, async (req, res) => {
  const flight = await req.dbServices.custom.getById(req.params.id);
  const seat = {
    type: req.body.type,
    price: req.body.price,
    qty: req.body.qty,
  };
  try {
    const savedSeat = await req.dbServices.seat.create(seat);
    flight.seats.push(savedSeat._id);
    await req.dbServices.custom.updateById(req.params.id, flight);

    res.redirect(`/custom/details/${req.params.id}`);
  } catch (error) {
    res.locals.errors = error.message;
    res.redirect(`/custom/details/${req.params.id}?errors=${error}`);
  }
});

router.post('/:id/seats/:seatId/book', usersOnly, async (req, res) => {
  const flight = await req.dbServices.custom.getByIdPopulatedMod(
    req.params.id,
    'seats'
  );
});

module.exports = router;
