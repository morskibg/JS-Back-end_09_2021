const dbUtils = require('../config/db_utils');
const router = require('express').Router();

const allCubes = dbUtils.getAllCubics();

router.get('/:searchWord',(req, res) =>{

});