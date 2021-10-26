const mongoose = require("mongoose")

const CustomSchema = new mongoose.Schema({
	title: { type: String, required: true, unique:true },
	description: { type: String, required: true },
	imageUrl: { type: String, required: true },
	isPublic: { type: Boolean, required: true, default: false },
	createdAt: { type: Date, required: true },
	usersLiked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

// Not working with LEAN !!!!
// CustomSchema.virtual('likes').get(function() {
//   return this.usersLiked.length;    
// });

// CustomSchema.set('toObject', { virtuals: true })
// CustomSchema.set('toJSON', { virtuals: true })


// userSchema.virtual('domain').get(function() {
// 	return this.email.slice(this.email.indexOf('@') + 1);
// });
// CHANGE THE NAME
const Custom = mongoose.model("Play", CustomSchema)

module.exports = Custom
