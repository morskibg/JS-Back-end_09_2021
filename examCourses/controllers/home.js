const router = require('express').Router();

router.get('/', async (req, res) => {
  const courses = await req.dbServices.custom.getAll();

  res.render('home', { courses });
});

module.exports = router;
