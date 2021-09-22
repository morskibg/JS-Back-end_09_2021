const url = require('url');

const handlers = require('../request_handlers/request_handlers');
const api = require('../api/api');

const handlerDispatcher_ = (route) => {     
    return {       
        '/': handlers.indexHandler,
        '/search': handlers.indexHandler,
        '/cats/add-cat':handlers.addCatHandler,
        '/content': handlers.staticHandler,
        '/cats/add-breed' : handlers.addBreedHandler,
        '/cats-edit' : handlers.editCatHandler,
        '/cats-find-new-home' : handlers.shelterCatHandler,
        '/apiGetCatDataById': api.apiGetCatDataById,
        '/apiGetAllBreeds': api.apiGetAllBreeds,
    }[route];    
}

const router = function (req, res){
    const parsedPath = url.parse(req.url, true).pathname
    const route = parsedPath.startsWith('/content') 
                    || parsedPath === '/favicon.ico' 
                    || parsedPath.endsWith('.js') 
                    ? '/content' : parsedPath;                
       
    // handlerDispatcher_(route).apply(null, [req, res]);    
    handlerDispatcher_(route)(req,res);  
}

const toExport = {
    router,
};

module.exports = toExport;