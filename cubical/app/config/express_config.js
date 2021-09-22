const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path')
// const bodyParser = require('body-parser');

module.exports = (app) => {

    app.engine('hbs', handlebars({
        extname: 'hbs',
        defaultLayout:'main'
    })); 

    app.set('views',path.join(process.cwd(), 'views'));
    
    app.set('view engine', 'hbs')

    app.use(express.urlencoded({ extended: false }))

    app.use(express.static(path.join(process.cwd(), 'static')));

    //TODO: Setup the view engine

    //TODO: Setup the body parser

    //TODO: Setup the static files

};