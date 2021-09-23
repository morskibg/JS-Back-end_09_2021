const dbUtils = require('../config/db_utils')
const router = require('express').Router()

const allCubes = dbUtils.getAllCubics()
// console.log('allCubes: ', allCubes);

router.get('/',(req, res) =>{
    payLoad = {
        title:'Browser',
        cubes:allCubes,
    };
    res.render('index', payLoad);
});

module.exports = router;
