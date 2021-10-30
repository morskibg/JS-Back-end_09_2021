const express = require('express');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const customValidators = require('../middlewares/customValidators.js');

const processAuth = require('../middlewares/auth.js');

module.exports = app => {
  app.engine(
    'hbs',
    hbs({
      extname: '.hbs',
    })
  );
  app.set('view engine', '.hbs');
  app.use(express.static('static'));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(processAuth);
  app.use(customValidators);
};
//// explicit path
// const path = require('path')
// app.set('views',path.join(process.cwd(), 'views'));
// app.use(express.static(path.join(process.cwd(), 'static')));
