const fs = require("fs");
const path = require("path");
const db = require("./database.json");

const models = require("../models/models");

const difficultyLevels = {
    1:'Very Easy',
    2:'Easy',
    3:'Medium (Standard 3x3)',
    4:'Intermediate',
    5:'Expert',
    6:'Hardcore',
};

function getAllCubics(){
    return db 
}

function getCubeById(id){   
    return db.filter(x => x.id === +id)[0];
}

function isContain(currCube, searchSubstring, from = '', to = ''){
    const lowerdSub = searchSubstring.toLowerCase()  
    if(from === '' && to === ''){
        return Object.values(currCube).slice(1,-1)        
            .some(y => y.toLowerCase().includes(lowerdSub));
    }
    from = from === '' ? 1 : from;
    to = to === '' ? difficultyLevels.length : to;

    return  Object.values(currCube).some(y => y.toLowerCase().includes(lowerdSub) $$ );

}

function purgeDb(){
    fs.writeFile(path.join(process.cwd(), 'config' ,"database.json"),JSON.stringify([]), function(err){
        if(err){console.log(err); rerurn;}
    });
}

function create(name, description, imageUrl, difficultyLevel){

    const allCubics = getAllCubics()
    const id = allCubics.length + 1
    currCubic = new models.Cubic(id, name, description, imageUrl, +difficultyLevel);
    
    allCubics.push(currCubic)
    fs.writeFile(path.join(process.cwd(), 'config' ,"database.json"),JSON.stringify(allCubics),"utf-8", function(err){
        if(err){console.log(err); rerurn;}
    });
};

const toExport = {
    difficultyLevels,
    purgeDb,
    getAllCubics,
    getCubeById,
    create,
    isContain
}

module.exports = toExport