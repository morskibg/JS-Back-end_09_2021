// const env = process.env.NODE_ENV || 'development';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret, saltRounds } = require('../config/config');

console.log('secret: ', secret);

async function getUserByName(userName) {
	return User.findOne({ username: userName.toLowerCase() });
}

async function addUser(username, password, repeatPassword) {
	const existingUser = await User.findOne({ username: username.toLowerCase() });
	if (existingUser) throw new Error('User already exist !');
	if (password !== repeatPassword) throw new Error('Passowrds not match !');

	const salt = await bcrypt.genSalt(saltRounds);
	const hashedPassword = await bcrypt.hash(password, salt);
	return User.create({ username: username.toLowerCase(), password: hashedPassword });
	// using promises !!!
	// bcrypt.genSalt(saltRounds)
	// 	.then((salt) => bcrypt.hash(password, salt)
	// 		.then((hash) => User.create({ username: username.toLowerCase(), password: hash }))
	// 		.catch((err) => console.log(err)));
}

async function login(username, password) {
	try {
		const dbUser = await User.findOne({ username: username.toLowerCase() });
		if (!dbUser) throw new Error('Wrong user or password !');
		const isCorrectPassword = await bcrypt.compare(password, dbUser.password);
		if (!isCorrectPassword) throw new Error('Wrong user or password !');
		const token = jwt.sign({ userId: dbUser._id }, secret);
		return token;
	} catch (error) {
		throw new Error(error);
	}
}

const toExport = {
	getUserByName,
	addUser,
	login,
};

module.exports = toExport;
