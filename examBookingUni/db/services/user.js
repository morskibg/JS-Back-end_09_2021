const User = require('../models/User.js')

// check if these are good.
module.exports = {
	createNew: async (userData) =>
		await new User(userData).save(),

	getByEmail: async (email) =>
		await User.findOne({ email }).lean(),

	getByUsername: async (username) =>
		await User.findOne({ username }).lean(),

	update: async (_id, updated) =>
		await User.findByIdAndUpdate(_id, updated),

	getById: async (_id) =>
		await User.findById(_id).populate('bookedHotels').lean(),

	addHotel: async (hotelId, userId) => {
		const user = await User.findOne({ _id: userId });
		
		user.offeredHotels.push(hotelId);

		await user.save();
	},

	addBooked: async (hotelId, userId) => {
		const user = await User.findOne({ _id: userId });
		
		user.bookedHotels.push(hotelId);

		await user.save();
	},
}