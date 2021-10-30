const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

// const mongoose = require('mongoose')

// const UserSchema = new mongoose.Schema({
// 	name: {
// 		type: String,
// 		required: true,
// 		validate: /^[A-Za-z]+[ ]{1}[A-Za-z]+$/ },
// 	username: {
// 		type: String,
// 		required: true,
// 		minLength: 5,
// 	 },
// 	password: {
// 		type: String,
// 		required: true,
// 		minLength: 4,
// 	},
// })

// const User = mongoose.model('User', UserSchema)

// module.exports = User

///////////////////////////////////////////////////////////////////////////////////////////////

// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
// 	email: {
// 		type: String,
// 		required: true,
// 	},
// 	password: {
// 		type: String,
// 		required: true,
// 	},
// 	gender: {
// 		type: String,
// 		enum: ['male', 'female'], // ???
// 		required: true,
// 	},
// 	tripHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Custom' }],
// });

// module.exports = mongoose.model('User', userSchema);
