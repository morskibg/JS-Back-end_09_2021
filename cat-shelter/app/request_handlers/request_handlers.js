const fs = require('fs');
const fsPromise = require('fs/promises');
const url = require('url');
const path = require('path');
const formidable = require('formidable');

const models = require('../models/models');
const config = require('../config');

const imgPath = path.join(config.contentFolder, config.imageFolder)

function handleCatForm(req, res, isEdit = false, isDelete = false){
    const form = new formidable.IncomingForm();
    let incommingFileName;
    form.maxFileSize = 50 * 1024 * 1024; // 5MB            
    form.multiples = false;
    
    form.parse(req, function (err, fields, files) {
        if (err) {
            res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
            res.end(String(err));
            return;
        }else{              
            try{
                incommingFileName = files['upload']['name'];
                const ext = incommingFileName.split('.').pop();                       
                if(ext !== 'jpg' && ext !== 'png'){
                    res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
                    res.end(String(err));
                    return;       
                }                        
                const incommingFileOldpath = files['upload']['path'];                        
                fs.rename(incommingFileOldpath, path.join(imgPath,incommingFileName), function (err) {
                    if(err){
                        handleError_(err, res);
                        return;
                    }
                    res.end();
                });     
            }catch{
                console.log('missing image file !');
            }              
            
            const catName = fields['name'];            
            const catDescr = fields['description'];
            const catBreed = fields['breed'];

            if(!isEdit){
                const newCat = new models.Cat(catName, catDescr, catBreed, incommingFileName);                
                newCat.save()
            }else{                        
                const catId = url.parse(req.url, true).query.id;                
                const currCat = {catId, catName, catDescr, catBreed, incommingFileName, isDelete};               
                console.log('currCat: ', currCat);
                models.Cat.update(currCat);                              
            }            
            res.setHeader('location', '/');
            res.statusCode = 302;
            res.end();
        }                
    });       
}

function getContentType_(url) {
    if (url.endsWith('css')) {
        return 'text/css';
    } else if (url.endsWith('html')) {
        return 'text/html';
    } else if (url.endsWith('png')) {
        return 'image/png';
    } else if (url.endsWith('jpg') || url.endsWith('jpeg')) {
        return 'image/jpg';
    } else if (url.endsWith('js')) {
        return 'text/jscript';
    } else if (url.endsWith('ico')) {
        return 'image/x-icon';
    }
}

function handleError_(e, res){
    console.log(e.message);
    res.writeHead(404, {
        'Content-Type': 'text/plain'
    });
    res.write('Not Found');
    res.end();    
}

const renderView_ = function(res, pathToFile,contentType, placeHolder, dataString){

    fsPromise.readFile(pathToFile).then(contents => {
        res.setHeader("Content-Type", contentType);
        res.writeHead(200);
        if(placeHolder !== undefined && dataString !== undefined){
            
            const modContent = contents.toString().replace(placeHolder, dataString);
            res.end(modContent);

        }else{res.end(contents);}
        
    })    
}

function staticHandler(req, res){    
   
    const pathname = url.parse(req.url, true).pathname;          
    fsPromise.readFile(path.join(`./${pathname}`))
        .then(contents => {
            let contentType = getContentType_(pathname);
            res.writeHead(200, {
                'Content-Type': contentType
            });
            res.write(contents);
            res.end();
        }).catch(error => {
            handleError_(error, res);
            return;
        });
}

function indexHandler(req, res){
    const parsedUrl = url.parse(req.url, true);
    const queryStr = parsedUrl.query
    
    const catsInDB = queryStr.search !== undefined
        ? models.Cat.getCatsFromDB().filter(cat => models.Cat.isContain(cat, queryStr.search.toLowerCase()))
        : models.Cat.getCatsFromDB();
    console.log('imgPath', imgPath);
    fsPromise.readFile(path.join(process.cwd(),config.viewsFolder, config.homeFolder,"index.html"), 'utf-8')
        .then(contents => {
            
            const dbCats = catsInDB.map((cat) =>
                `<li>
                    <img src="${path.join(imgPath, cat.image)}" alt="${cat.name}">
                    <h3></h3>
                        <p><span>Breed: </span>${cat.breed}</p>
                        <p><span>Description: </span>${cat.description}</p>
                    <ul class="buttons">
                            <li class="btn edit"><a href="/cats-edit?id=${cat.id}">Change Info</a></li>
                            <li class="btn delete"><a href="/cats-find-new-home?id=${cat.id}">New Home</a></li>
                    </ul>
                </li>`
            );
            const allCats = contents.toString().replace('{{cats}}', dbCats);
            
            res.write(allCats);
            res.end();           
        }) 
}

function addCatHandler(req, res){
    
    if(req.method === 'GET'){             
        const breedsInDB = models.Breed.getBreedsFromDB().map((x) => x.breed);
        const breedDropdown = breedsInDB.map((x) => `<option value="${x}">${x}</option>`);  
        renderView_(res, path.join(process.cwd(),config.viewsFolder,"addCat.html"), "text/html", '{{catBreeds}}', breedDropdown );
    }else{            
        handleCatForm(req, res);        
    }   
}

function addBreedHandler(req, res){

    if(req.method === 'GET'){
        renderView_(res, path.join(process.cwd(),config.viewsFolder,"addBreed.html"), "text/html"); 
    }else{
        const form = new formidable.IncomingForm();
        
        form.parse(req, function (err, fields, files) {
            
            const inputBreed = fields['breed'];
            const newBreed = new models.Breed(inputBreed);
            newBreed.save();
            res.setHeader('location', '/');
            res.statusCode = 302;
            res.end();
        });
    }
}

function editCatHandler(req, res){
    
    if(req.method === 'GET'){        
        renderView_(res, path.join(process.cwd(),config.viewsFolder,"editCat.html"), "text/html"); 
    }else{        
        handleCatForm(req, res, isEdit = true);
    }
}

function shelterCatHandler(req, res){
    
    if(req.method === 'GET'){        
        renderView_(res, path.join(process.cwd(),config.viewsFolder,"catShelter.html"), "text/html"); 
    }else{   
        handleCatForm(req, res, isEdit = true, isDelete = true);        
    }
}

const toExport = {
    staticHandler,
    indexHandler,
    addCatHandler,
    addBreedHandler,
    editCatHandler,
    shelterCatHandler,   
};

module.exports = toExport;
