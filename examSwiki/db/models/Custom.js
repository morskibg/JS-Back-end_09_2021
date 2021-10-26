const mongoose = require("mongoose")

const CustomSchema = new mongoose.Schema({
	title: { type: String, required: true },	
	description: { type: String, required: true },
	creationDate: { type: Date, required: true,},	
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

})

// CHANGE THE NAME
const Custom = mongoose.model("Article", CustomSchema)

module.exports = Custom
