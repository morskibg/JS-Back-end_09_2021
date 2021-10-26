const router = require('express').Router();

router.get('/', async (req, res) => {
  const houses = await req.dbServices.custom.getAllOrderAndLimit(3);
  res.render('home', { houses });
});

router.get('/search', async (req, res) => {
  if (Object.keys(req.query).length === 0) {
    res.render('search', {});
  } else {
    const houses = await req.dbServices.custom.getFilteredByType(
      req.query.search
    );
    res.render('search', { houses });
  }
});

module.exports = router;
