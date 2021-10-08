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
		min: 0,
    max: 4

	},
	price: {
		type: Number,
		required: true,
		min: 1,
    max: 50
	},
	description: {
		type: String,
		required: true,
	},
	creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	buddies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

customSchema.post("findOneAndUpdate", async function(doc) {  
	const beforeSeats = doc.seats;
	const afterSeats = this._update['$set'].seats;

	if(beforeSeats > afterSeats){		
		const docToUpdate = await this.model.findOne(this.getQuery());

		if(docToUpdate.buddies.length > afterSeats){			
				docToUpdate.buddies = docToUpdate.buddies.slice(0, afterSeats);
			await docToUpdate.save();
		}		
	}
});

// customSchema.pre('findOneAndUpdate', async function() {
//   const docToUpdate = await this.model.findOne(this.getQuery());
//   console.log("🚀 ~ file: Custom.js ~ line 58 ~ customSchema.pre ~ docToUpdate", docToUpdate)
  
// });


// customSchema.pre("findOneAndUpdate", async function() {
//   console.log("I am working");
// 	console.log(this._update.seats);
// 	const docToUpdate = await this.model.findOne(this.getQuery());
  
// 	if(docToUpdate.buddies.length > this._update.seats){

// 	}
//   // const docToUpdate = await this.model.findOne(this.getQuery());
//   // console.log(docToUpdate); // The document that `findOneAndUpdate()` will modify
// });

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
