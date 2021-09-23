const dbUtils = require('../config/db_utils');
const router = require('express').Router();


router.get('/:id',(req, res) =>{
    
    const payLoad = dbUtils.getCubeById(req.params.id);
   
    res.render('details', payLoad);
});

module.exports = router;