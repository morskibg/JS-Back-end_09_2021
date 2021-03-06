const dbUtils = require('../config/db_utils');
const router = require('express').Router();


let diffLevelsObjArr = Object.entries(dbUtils.difficultyLevels).reduce((accum, currItem) =>{        
    accum.push({'id':currItem[0], 'level':currItem[1]});
    return accum;
},[]);

router.all('/purge_db',(req, res) =>{
    dbUtils.purgeDb();
    res.redirect('/');
});

router.get('/',(req, res) =>{
    const payLoad = {
        title:'Create',
        diffLevels:diffLevelsObjArr, 
    };
    res.render('create', payLoad);
});

router.post('/',(req, res) =>{    
    dbUtils.create(req.body.name, req.body.description, req.body.imageUrl, req.body.difficultyLevel);    
    res.redirect('/');
});

module.exports = router;