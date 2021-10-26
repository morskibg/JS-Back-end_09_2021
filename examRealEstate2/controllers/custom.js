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

// router.get('/', async (req, res) => {
//   const customs = await req.dbServices.custom.getAll();

//   res.render('custom', { customs });
// });

// CREATE
router.get('/create', usersOnly, (req, res) => res.render('create'));
router.post(
  '/create',
  usersOnly,
  body('name')
    .isLength({ min: 6 })
    .withMessage('Name must be at least 6 symbols long.'),
  body('type')
    .custom((value, { req }) => req.customValidators.isValidType(value, req))
    .withMessage('Type must be Apartment, Villa or House !'),
  body('year')
    .isInt({ min: 1850, max: 2021 })
    .withMessage('Year must be from 1850 to 2021'),
  body('city')
    .isLength({ min: 4 })
    .withMessage('City must be at least 4 symbols'),
  body('homeImage')
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Home Image must be a valid URL'),
  body('description')
    .isLength({ min: 60 })
    .withMessage('Descriptin must be at least 60 symbols'),
  body('qty')
    .isInt({ min: 0, max: 10 })
    .withMessage('Available pieces must be from 0 to 10'),
  async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const custom = {
        name: req.body.name,
        type: req.body.type,
        year: req.body.year,
        city: req.body.city,
        homeImage: req.body.homeImage,
        qty: req.body.qty,
        description: req.body.description,
        tenants: [],
        owner: req.user._id,
      };

      const house = await req.dbServices.custom.create(custom);

      res.redirect('/custom/houses');

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
  const house = await req.dbServices.custom.composeDetailsHouseObj(
    req.params.id,
    req.user._id
  );
  res.render('details', house);
  // let house = await req.dbServices.custom.getByIdPopulatedMod(
  //   req.params.id,
  //   'tenants'
  // );

  // if (req.user) {
  //   const tenantsList = house.tenantList();
  //   const isOwn = house.owner.equals(req.user._id);
  //   const alreadyRented = house.tenants.some(x => x._id.equals(req.user._id));
  //   const isAvailable = house.qty > house.tenants.length;
  //   const qty = house.qty - house.tenants.length;
  //   // house.tenantsList = house.tenants.map(x => x.name).join(', ');
  //   // if (house.tenants.length > 0) {
  //   //   house.tenantsList = house.tenantsList();
  //   // } else {
  //   //   house.tenantsList = false;
  //   // }
  //   house = house.toObject();
  //   res.render('details', {
  //     ...house,
  //     tenantsList,
  //     isOwn,
  //     alreadyRented,
  //     isAvailable,
  //     qty,
  //   });
  // }
});

// DELETE
router.get('/delete/:id', ownerOnly, async (req, res) => {
  await req.dbServices.custom.deleteById(req.params.id);
  res.redirect('/custom/houses');
});

// EDIT
router.get('/edit/:id', ownerOnly, async (req, res) => {
  const play = await req.dbServices.custom.getById(req.params.id);
  res.render('edit', play);
});
router.post(
  '/edit/:id',
  usersOnly,
  body('name')
    .isLength({ min: 6 })
    .withMessage('Name must be at least 6 symbols long.'),
  body('type')
    .custom((value, { req }) => req.customValidators.isValidType(value, req))
    .withMessage('Type must be Apartment, Villa or House !'),
  body('year')
    .isInt({ min: 1850, max: 2021 })
    .withMessage('Year must be from 1850 to 2021'),
  body('city')
    .isLength({ min: 4 })
    .withMessage('City must be at least 4 symbols'),
  body('homeImage')
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Home Image must be a valid URL'),
  body('description')
    .isLength({ min: 60 })
    .withMessage('Descriptin must be at least 60 symbols'),
  body('qty')
    .isInt({ min: 0, max: 10 })
    .withMessage('Available pieces must be from 0 to 10'),
  async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const updatedPlay = {
        name: req.body.name,
        type: req.body.type,
        year: req.body.year,
        city: req.body.city,
        homeImage: req.body.homeImage,
        qty: req.body.qty,
        description: req.body.description,
        tenants: [],
        owner: req.user._id,
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
  '/rent/:id',
  usersOnly,
  notOwnerOnly,
  notInvolvedOnly,
  async (req, res) => {
    const house = await req.dbServices.custom.getById(req.params.id);

    // if (!house.tenants.some(x => x._id.equals(req.user._id))) {
    // }
    house.tenants.push(req.user._id);

    await req.dbServices.custom.updateById(req.params.id, house);

    res.redirect(`/custom/details/${req.params.id}`);
  }
);

router.get('/houses', async (req, res) => {
  const houses = await req.dbServices.custom.getAll();

  res.render('houses', { houses });
});

module.exports = router;
