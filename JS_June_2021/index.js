global.basedir = __dirname;
const app = require('express')();
const config = require('./config/config');

require('./config/express')(app);
require('./config/routes')(app);
const dbInit = require('./config/db');

const { connectionString, port, dbName } = config;

dbInit(`${connectionString}/${dbName}`);

app.listen(port, (err) => {
	if (err) {
		console.log('Web servere is not running !');
		console.log(err);
		return;
	}
	console.log(`Listening on port ${config.port}! Now its up to you...`);
});
