const fs = require('fs');
const path = require('path');
const config = require('../config')
console.log(process.cwd());
console.log(path.join(process.cwd(), config.catsDbFileFolder, config.breedsDbFileName));

class Breed{

    static dbFilePath = path.join(process.cwd(), config.catsDbFileFolder, config.breedsDbFileName)   
    constructor(breed){
        this.breed = breed;
    }

    static getBreedsFromDB(){       
        const existingBreedsJsonString = fs.readFileSync(Breed.dbFilePath,"utf-8");        
        const existingBreeds = JSON.parse(existingBreedsJsonString);
        return existingBreeds;
    }

    save(){
        
        const existingBreeds = Breed.getBreedsFromDB();
        
        if(existingBreeds.length > 0){ 
               
            const isBreedExist = existingBreeds.find((x) => x.breed === this.breed);             
            
            if(isBreedExist !== undefined){return};
        }                
        existingBreeds.push(this);        
        fs.writeFileSync(Breed.dbFilePath,JSON.stringify(existingBreeds),"utf-8");        
    }

}

class Cat{

    static dbFilePath = path.join(process.cwd(), path.join(config.catsDbFileFolder, config.catsDbFileName));
    constructor(name,description, breed, image){
        this.id = this.createId_();
        this.name = name;
        this.description = description;
        this.image  = image;
        this.breed  = breed;
    }

    createId_() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static isContain(currCat, searchSubstring){
        const isContain = Object.values(currCat)
            .slice(1)
            .some(x => x.toLowerCase()
            .includes(searchSubstring));

        return isContain;       

    }

    static getCatsFromDB(){       
        const existingCatsJsonString = fs.readFileSync(Cat.dbFilePath,"utf-8");        
        const existingCats = JSON.parse(existingCatsJsonString);
        return existingCats;
    }
    
    static getCatById(id){
        const currCat = Cat.getCatsFromDB().find(x => x.id === id);
        // const currCat = Array.from(Cat.getCatsFromDB()).find(x => x.id === id);
        return currCat;
    }

    static update(currCat){

        const currCatinDb = Cat.getCatById(currCat.catId);
        const existingCats = Cat.getCatsFromDB();
       
        const updatedCats = existingCats.reduce((acum, cat) => {
            if(cat.id !== currCat.catId){
                acum.push(cat);
            }
            return acum;
        },[]);

        if(!currCat.isDelete){
            const modifiedCat = {            
                'id':currCat.catId,
                'name':currCat.catName,
                'description': currCat.catDescr, 
                'breed':currCat.catBreed,
                'image':currCat.incommingFileName.length === 0 ? currCatinDb.image : currCat.incommingFileName 
            }; 
            updatedCats.push(modifiedCat);    
        }else{
            const filePath = path.join(config.contentFolder, config.imageFolder, currCatinDb.image)
           
            fs.unlinkSync(filePath)
        }         
        fs.writeFile(Cat.dbFilePath,JSON.stringify(updatedCats),"utf-8", function(err){
            console.log(err);
        });        
    }

    save(){
        const existingCats = Cat.getCatsFromDB();
        existingCats.push(this);        
        fs.writeFile(Cat.dbFilePath,JSON.stringify(existingCats),"utf-8", function(err){
            console.log(err);
        });               
    }
}

const toExport = {
    Breed,
    Cat
};

module.exports = toExport;

