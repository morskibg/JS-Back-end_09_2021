const router = require('express').Router()

router.get('/',(req, res) =>{
    const payLoad = {
        title:'About',
        
    };
    res.render('about', payLoad);
});

module.exports = router;