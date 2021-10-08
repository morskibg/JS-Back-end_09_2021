const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	name: { 
		type: String, 
		required: true,
		validate: /^[A-Za-z]+[ ]{1}[A-Za-z]+$/ },
	username: { 
		type: String, 
		required: true, 
		minLength: 5,
	 },
	password: { 
		type: String, 
		required: true, 
		minLength: 4,
	},	
})

const User = mongoose.model('User', UserSchema)

module.exports = User