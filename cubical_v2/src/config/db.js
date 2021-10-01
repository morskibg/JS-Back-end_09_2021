const mongoose = require('mongoose');

const initDb = function (connectionString) {
	return mongoose
		.connect(connectionString, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => console.log('Connected to db !'))
		.catch((err) => {
			console.log('Unable to connect to database ! Aborting !');
			console.log(err);
			process.exit(1);
		});
};
module.exports = initDb;
