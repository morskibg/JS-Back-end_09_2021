const mongoose = require('mongoose');

const cubeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name is required!'],
		minLength: [1, 'At least 1 symbol! Got {VALUE}'],
		maxLength: [50, 'Max alowed length is 50 symbols! Got {VALUE}'],
	},
	description: {
		type: String,
		required: [true, 'Description is required!'],
		minLength: [1, 'At least 1 symbol! Got {VALUE}'],
		maxLength: [500, 'Max alowed length is 500 symbols! Got {VALUE}.'],
	},
	imageUrl: {
		type: String,
		required: [true, 'Image URL is required!'],
		match: /^https?/,
	},
	difficultyLevel: {
		type: Number,
		required: true,
		min: 1,
		max: 6,
	},
	accessories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Accessory' }],
});

module.exports = mongoose.model('Cube', cubeSchema);
