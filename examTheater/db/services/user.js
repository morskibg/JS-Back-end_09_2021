const User = require('../models/User.js')

// check if these are good.
module.exports = {
	createNew: async (userData) =>
		await new User(userData).save(),

	// getByEmail: async (email) =>
	// 	await User.findOne({ email }).lean(),

	getByUsername: async (username) =>
		await User.findOne({ username }).lean(),

	update: async (_id, updated) =>
		await User.findByIdAndUpdate(_id, updated),

	getById: async (_id) =>
		await User.findById(_id).populate('tripsHistory').lean(),

	addCourse: async (courseId, userId) => {
		const user = await User.findOne({ _id: userId })
		console.log(user);
		user.cources.push(courceId);

		await user.save();
		
	},
}