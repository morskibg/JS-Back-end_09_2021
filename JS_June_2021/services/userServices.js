const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret, saltRounds } = require('../config/config');

async function addUser(userData) {
	const {email, password, rePassword, gender}	= userData;
	const existingUser = await User.findOne({ email: email.toLowerCase() });
	if (existingUser) throw new Error('User already exist !');
	if (password !== rePassword) throw new Error('Passowrds not match !');

	const salt = await bcrypt.genSalt(saltRounds);
	const hashedPassword = await bcrypt.hash(password, salt);
	return User.create({ email: email.toLowerCase(), password: hashedPassword, gender: gender });
}

async function login(loginData) {
	try {
		const { email, password } = loginData;
		const dbUser = await User.findOne({ email: email.toLowerCase() });
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
	addUser,
	login,	
};

module.exports = toExport;