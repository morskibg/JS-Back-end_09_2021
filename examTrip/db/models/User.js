const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	gender: {
		type: String,
		enum: ['male', 'female'], // ???
		required: true,
	},
	tripHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Custom' }],
});

module.exports = mongoose.model('User', userSchema);

// const mongoose = require('mongoose')

// // UPDATE THE SCHEMA
// const UserSchema = new mongoose.Schema({
// 	email: { type: String, required: true, unique: true },
// 	fullName: String,
// 	hashedPassword: { type: String, required: true },
// 	offersBought: [{ type: 'ObjectId', ref: 'Offer' }],
// })

// const User = mongoose.model('User', UserSchema)

// module.exports = User
