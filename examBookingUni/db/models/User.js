const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	username: { type: String, required: true, unique: true },
	hashedPassword: { type: String, required: true },	
	bookedHotels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }],
	offeredHotels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }],
})

const User = mongoose.model('User', UserSchema)

module.exports = User