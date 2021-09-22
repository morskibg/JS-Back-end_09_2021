const url = require('url');
const models = require('../models/models');

function apiGetCatDataById(req, res){
    
    const catId = url.parse(req.url, true).query.id;
    const selectedCat = models.Cat.getCatById(catId);    
    res.write(JSON.stringify(selectedCat));
    res.end();
}

function apiGetAllBreeds(req, res){

    const allBreeds = models.Breed.getBreedsFromDB().map(x => x.breed);  
    res.write(JSON.stringify(allBreeds));
    res.end();
}

const toExport = {
    apiGetCatDataById,
    apiGetAllBreeds,
    
};

module.exports = toExport;