const router = require('express').Router();

router.get('/', async (req, res) => {
  const expenses = await req.dbServices.custom.getAll();
  res.render('home', { expenses });
});

module.exports = router;
