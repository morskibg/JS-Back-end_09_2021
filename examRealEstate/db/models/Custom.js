const mongoose = require("mongoose")

const CustomSchema = new mongoose.Schema({
	name: { 
		type: String, 
		required: true,
		minLength: 6,
	},
	type: { type: String, required: true },
	year: { 
		type: Number, 
		required: true,
		min: 1850,
		max: 2021,
	},	
	city: { 
		type: String, 
		required: true,
		minLength: 4,
	},
	homeImg: { 
		type: String, 
		required: true,
		validate: /^https?:\/\//,
	},
	description: { 
		type: String, 
		required: true,
		maxLength: 60,
	},
	availablePieces: { 
		type: Number, 
		required: true,
		min:0,
		max: 10, 
	},
	tenants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],	
	creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

CustomSchema.post("findOneAndUpdate", async function(doc) {
	const before = doc.availablePieces;
	const after = this._update['$set'].availablePieces;

	if(before > after){		
		const docToUpdate = await this.model.findOne(this.getQuery());

		if(docToUpdate.tenants.length > after){			
				docToUpdate.tenants = docToUpdate.tenants.slice(0, after);
			await docToUpdate.save();
		}		
	}
})

// CHANGE THE NAME
const Custom = mongoose.model("Home", CustomSchema)


module.exports = Custom
