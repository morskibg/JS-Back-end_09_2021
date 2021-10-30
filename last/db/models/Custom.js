const mongoose = require("mongoose")

const CustomSchema = new mongoose.Schema({
	merchant: { type: String, required: true },
	total: { type: Number, required: true },
	category: { type: String, required: true },
	description: { type: String, required: true },
	report: { type: Boolean, required: true, defdault:false},
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	creator: { type: String, required: true },

})

// CHANGE THE NAME
const Custom = mongoose.model("Trip", CustomSchema)

module.exports = Custom
