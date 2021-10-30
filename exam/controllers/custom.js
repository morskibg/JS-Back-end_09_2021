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
// body('total')
// .default(0)
// .isFloat({ min: 0 })
// .withMessage('Total should be positive'),

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
  body('title')
    .isLength({ min: 6 })
    .withMessage('Title must be at least 6 symbols long !'),
  body('keyword')
    .isLength({ min: 6 })
    .withMessage('Keyword must be at least 6 symbols long! '),
  body('location')
    .isLength({ max: 10 })
    .withMessage('Location must be 10 symbols max !'),
  body('dateStr')
    .matches(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)
    .withMessage('Date must be in format "dd.mm.yyyy" !'),
  body('image')
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Image must be a valid URL !'),
  body('description')
    .isLength({ min: 8 })
    .withMessage('Description must be at least 8 symbols !'),

  async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const custom = {
        title: req.body.title,
        keyword: req.body.keyword,
        location: req.body.location,
        dateStr: req.body.dateStr,
        createdAt: Date.now(),
        image: req.body.image,
        description: req.body.description,
        author: req.user._id,
        voted: [],
        rating: 0,
      };

      const post = await req.dbServices.custom.create(custom);
      await req.dbServices.user.addPost(post._id, req.user._id);

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
router.get('/details/:id', async (req, res) => {
  const custom = await req.dbServices.custom.getByIdPopulated(req.params.id);
  const authorData = await req.dbServices.user.getById(custom.author);

  if (req.user) {
    custom.isOwn = custom.author.equals(req.user._id);
    custom.alreadyVoted = custom.voted.some(x => x._id.equals(req.user._id));
  }

  custom.authorName = `${authorData.firstName} ${authorData.lastName}`;
  if (custom.voted.length !== 0) {
    custom.votedArr = custom.voted.map(x => x.email).join(', ');
  }

  res.render('details', custom);
});

// DELETE
router.get('/delete/:id', usersOnly, ownerOnly, async (req, res) => {
  await req.dbServices.custom.deleteById(req.params.id);
  res.redirect('/custom/all');
});

// EDIT
router.get('/edit/:id', usersOnly, ownerOnly, async (req, res) => {
  const post = await req.dbServices.custom.getById(req.params.id);
  res.render('edit', post);
});
router.post(
  '/edit/:id',
  ownerOnly,
  body('title')
    .isLength({ min: 6 })
    .withMessage('Title must be at least 6 symbols long !'),
  body('keyword')
    .isLength({ min: 6 })
    .withMessage('Keyword must be at least 6 symbols long! '),
  body('location')
    .isLength({ max: 10 })
    .withMessage('Location must be 10 symbols max !'),
  body('dateStr')
    .matches(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)
    .withMessage('Date must be in format "dd.mm.yyyy" !'),
  body('image')
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Image must be a valid URL !'),
  body('description')
    .isLength({ min: 8 })
    .withMessage('Description must be at least 8 symbols !'),
  async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const updatedPost = {
        title: req.body.title,
        keyword: req.body.keyword,
        location: req.body.location,
        dateStr: req.body.dateStr,
        createdAt: Date.now(),
        image: req.body.image,
        description: req.body.description,
      };
      await req.dbServices.custom.updateById(req.params.id, updatedPost);

      res.redirect(`/custom/details/${req.params.id}`);
    } else {
      res.locals.errors = createErrorMsg(errors);

      res.render('edit', req.body);
    }
  }
);

router.get('/vote_up/:id', usersOnly, notOwnerOnly, async (req, res) => {
  const vote = await req.dbServices.custom.getById(req.params.id);
  vote.voted.push(req.user._id);
  vote.rating++;

  await req.dbServices.custom.updateById(req.params.id, vote);

  res.redirect(`/custom/details/${req.params.id}`);
});

router.get('/vote_down/:id', usersOnly, notOwnerOnly, async (req, res) => {
  const vote = await req.dbServices.custom.getById(req.params.id);
  vote.voted.push(req.user._id);
  vote.rating--;

  await req.dbServices.custom.updateById(req.params.id, vote);

  res.redirect(`/custom/details/${req.params.id}`);
});

router.get('/all', async (req, res) => {
  const posts = await req.dbServices.custom.getAll();

  res.render('all-posts', { posts });
});

router.get('/own-posts', usersOnly, async (req, res) => {
  const myPosts = await req.dbServices.custom.getOwnPosts(req.user._id);
  myPosts.forEach(element => {
    element.authorName = `${element.author.firstName} ${element.author.lastName}`;
  });

  res.render('my-posts', { myPosts });
});

module.exports = router;
