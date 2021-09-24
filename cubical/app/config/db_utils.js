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
    
    try{
        from = Number(from);
    }catch{from = from};
    try{
        to = Number(to);
    }catch{to = to};
    
    if(searchSubstring === ''){return true;}
    const upperDiff = Object.values(difficultyLevels).length;    
    const lowerdSub = searchSubstring.toLowerCase();
   
    if(!Number(from) && !Number(to)){
        from = 1;
        to = upperDiff;
    }else if(!Number(from) || from < 1 || from > upperDiff ){                                                   // "from" is empty or outside the limits 
                 
        to = to >= 1 && to <= upperDiff ? to : to < 1 ? 1 : to > upperDiff ? upperDiff : to;                    // adjusting "to" to be inside limits 
        from = to ;
    }else if(!Number(to) || to < 1 || to > upperDiff){              
        from = from >= 1 && from <= upperDiff ? from : from < 1 ? 1 : from > upperDiff ? upperDiff : from;
        to = from ;
    }else if(from > to){
        to = from ;
    }; 
    const booleanToReturn = Object.values(currCube).slice(1).reduce((accum, currItem, index) =>{
        if(index < 3){            
            accum = currItem.toLowerCase().includes(lowerdSub) || accum;                   
        }else{
            accum = currItem >= from && currItem <= to && accum;          
        } 
        return accum;
    },false);

    return  booleanToReturn;
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