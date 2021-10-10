// const mongoose = require("mongoose")

// const CustomSchema = new mongoose.Schema({
// 	startPoint: { type: String, required: true },
// 	endPoint: { type: String, required: true },
// 	date: { type: String, required: true },
// 	time: { type: String, required: true },
// 	carImage: { type: String, required: true },
// 	carBrand: { type: String, required: true },
// 	seats: { type: Number, required: true },
// 	price: { type: Number, required: true },
// 	description: { type: String, required: true },
// 	creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// 	buddies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
// })

// // CHANGE THE NAME
// const Custom = mongoose.model("Trip", CustomSchema)

// module.exports = Custom
const mongoose = require("mongoose")

const CustomSchema = new mongoose.Schema({
	name: { 
		type: String, 
		required: true,
		unique: true,
	},	
	city: { 
		type: String, 
		required: true,		
	},
	imageUrl: { 
		type: String, 
		required: true,
		validate: /^https?:\/\//,
	},
	freeRooms: { 
		type: Number, 
		required: true,
		min:1,
		max: 100, 
	},
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	bookers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],	
})

// CustomSchema.post("findOneAndUpdate", async function(doc) {
// 	// const before = doc.freeRooms;
// 	// const after = this._update['$set'].availablePieces;
// 	const before = doc.bookers.length;
// 	const after = this._update['$set'].bookers.length;

// 	if(before > after){		
// 		const docToUpdate = await this.model.findOne(this.getQuery());

// 		if(docToUpdate.tenants.length > after){			
// 				docToUpdate.tenants = docToUpdate.tenants.slice(0, after);
// 			await docToUpdate.save();
// 		}		
// 	}
// })

// CHANGE THE NAME
const Custom = mongoose.model("Hotel", CustomSchema)


module.exports = Custom

