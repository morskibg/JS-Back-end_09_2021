const User = require('../models/User.js')
const Custom = require('../models/Custom.js')

// check if these are good.
module.exports = {
	createNew: async (userData) =>
		await new User(userData).save(),

	getByEmail: async (email) =>
		await User.findOne({ email }).lean(),

	trips: async (userId) => 
		 await Custom.find({ 'creator': userId }).lean(),	

	update: async (_id, updated) =>
		await User.findByIdAndUpdate(_id, updated),

	getByIdPopulated: async (_id) =>
		await User.findById(_id).populate('tripHistory').lean(), //!!!
}