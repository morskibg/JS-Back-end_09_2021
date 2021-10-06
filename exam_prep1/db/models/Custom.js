const mongoose = require('mongoose');

const customSchema = new mongoose.Schema({
	startPoint: {
		type: String,
		required: true,
	},
	endPoint: {
		type: String,
		required: true,
	},
	date: {
		type: String,
		required: true,
	},
	time: {
		type: String,
		required: true,
	},
	carImage: {
		type: String,
		required: true,
	},
	carBrand: {
		type: String,
		required: true,
	},
	seats: {
		type: Number,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	buddies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Custom', customSchema);



// const mongoose = require("mongoose")

// const CustomSchema = new mongoose.Schema({
// 	name: { type: String, required: true, unique: true },
// 	price: { type: Number, required: true, min: 0 },
// 	imageUrl: { type: String, required: true },
// 	brand: String,
// 	createdAt: Date,
// 	buyers: [{ type: 'ObjectId', ref: 'User' }],
// 	owner: 'ObjectId',
// })

// // CHANGE THE NAME
// const Custom = mongoose.model("Offer", CustomSchema)

// module.exports = Custom
