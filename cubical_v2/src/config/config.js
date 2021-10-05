require('dotenv').config();

const config = {
	development: {
		port: process.env.PORT || 3000,
		connectionString:
			process.env.ATLAS_MONGO_URI || 'mongodb://127.0.0.1:27017',
		dbName: 'cubeDB',
		saltRounds: 10,
		secret: 'yoYoNeverGGG',
		cookieName: 'user_session',
	},
	production: {
		connectionString: process.env.ATLAS_MONGO_URI,
		dbName: 'cubeDB',
		saltRounds: 10,
		secret: 'yoYoNeverGGG',
		cookieName: 'user_session',
	},
};

module.exports = config[process.env.NODE_ENV.trim()];
