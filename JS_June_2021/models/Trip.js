const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
	startPoint: {
		type: String,
		required: [true, 'Start Point is required!'], // ?? Message problem ??
	},
	endPoint: {
		type: String,
		required: [true, 'End Point is required!'],
	},
	date: {
		type: String,
		required: [true, 'Date is required!'],
	},
	time: {
		type: String,
		required: [true, 'Time is required!'],
	},
	carImage: {
		type: String,
		required: [true, 'Car Image is required!'],
	},
	carBrand: {
		type: String,
		required: [true, 'Car Brand is required!'],
	},
	seats: {
		type: Number,
		required: [true, 'Seats are required!'],
	},
	price: {
		type: Number,
		required: [true, 'Price is required!'],
	},
	description: {
		type: String,
		required: [true, 'Description is required!'],
	},
	creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	buddies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Trip', tripSchema);

