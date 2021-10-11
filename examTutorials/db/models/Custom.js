const mongoose = require("mongoose")

const CustomSchema = new mongoose.Schema({
	title: { type: String, required: true, unique:true },
	description: { type: String, required: true },
	imageUrl: { type: String, required: true },
	duration: { type: String, required: true },
	createdAt: { type: Date, required: true },
	users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

// CHANGE THE NAME
const Custom = mongoose.model("Course", CustomSchema)

module.exports = Custom
