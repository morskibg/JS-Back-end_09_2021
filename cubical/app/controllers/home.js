
const router = require('express').Router();
const dbUtils = require('../config/db_utils');


const allCubes = dbUtils.getAllCubics();


router.get('/',(req, res) =>{
    
    const payLoad = {
        title:'Browser',
        cubes:allCubes,
    };
    res.render('index', payLoad);
});

router.post('/',(req, res) =>{
    const searchWord = req.body.search;
    const from = req.body.from;
    const to = req.body.to;
    // const filteredCubesByWord = allCubes.filter(x => dbUtils.isContain(x, searchWord))
     
    const filteredCubes = allCubes.filter(x => dbUtils.isContain(x, searchWord, from, to));
        
    const payLoad = {
        title:'Browser',
        cubes:filteredCubes,
    };
    res.render('index', payLoad);
    // res.redirect('/')

});



module.exports = router;
