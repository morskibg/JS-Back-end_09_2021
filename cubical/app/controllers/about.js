const router = require('express').Router()

router.get('/',(req, res) =>{
    payLoad = {
        title:'About',
        
    };
    res.render('about', payLoad);
});

module.exports = router;