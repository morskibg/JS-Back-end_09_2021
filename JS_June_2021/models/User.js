const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, 'Email is required!'],
	},
	password: {
		type: String,
		required: [true, 'Password is required!'],
	},
	gender: {
		type: String,
		enum: ['male', 'female'], // ???
		required: [true, 'Gender is required!'],
	},
	tripHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
});

module.exports = mongoose.model('User', userSchema);


