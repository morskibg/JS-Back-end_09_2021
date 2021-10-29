const router = require('express').Router();

router.get('/', async (req, res) => {
  const flights = await req.dbServices.custom.getAll();
  res.render('home', { flights });
});

module.exports = router;
