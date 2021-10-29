const router = require('express').Router();

router.get('/', async (req, res) => {
  let plays = undefined;

  if (!req.user) {
    plays = await req.dbServices.custom.getSortedByLikes();
    plays = plays.slice(0, 3);
  } else {
    if (Object.keys(req.query).length !== 0) {
      if (req.query.criteria === 'by_likes') {
        plays = await req.dbServices.custom.getSortedByLikes();
      } else {
        plays = await req.dbServices.custom.getSortedByTimeCreated(
          (onlyPublic = false)
        );
      }
    } else {
      plays = await req.dbServices.custom.getSortedByTimeCreated(
        (onlyPublic = true)
      );
    }
  }

  res.render('home', { plays });
});

module.exports = router;
