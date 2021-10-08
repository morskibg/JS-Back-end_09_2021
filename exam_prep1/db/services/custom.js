const Custom = require("../models/Custom")

// check if these are good.
module.exports = {
	getAll: async () => await Custom.find({}).lean(),
	create: async entry => await new Custom(entry).save(),
	getById: async id => await Custom.findById(id).lean(),
	getByIdPopulated: async id => await Custom.findById(id).populate('creator').populate('buddies').lean(),
	deleteById: async id => await Custom.findByIdAndDelete(id),
	updateById: async (id, updated) => await Custom.findByIdAndUpdate(id, updated, { runValidators: true }),
	join: async (tripId, user) => {
		const trip = await Custom.findById(tripId)

		trip.buddies.push(user)

		await trip.save()
	},
// 	getAllSortedBuyers: async (type) =>
// 		await Custom.find({}).sort({ 'buyers': type }).lean(),
}
