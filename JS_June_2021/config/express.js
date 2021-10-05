const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');

const expressInit = function (app) {
	app.engine(
		'.hbs',
		handlebars({
			extname: '.hbs',
			defaultLayout: 'main',
			partialsDir: path.join(global.basedir, 'views/layouts/partials'),
		}),
	);

	app.set('views', path.join(global.basedir, 'views'));

	app.set('view engine', '.hbs');

	app.use(express.urlencoded({ extended: true }));

	app.use(express.static(path.join(global.basedir, 'static')));

	// app.use(cookieParser());
	// app.use(authMiddleware());
	// app.use(sniffer());
};
module.exports = expressInit;


