const mongoose = require('mongoose');

const CustomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  isPublic: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, required: true },
  likers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

// CHANGE THE NAME
const Custom = mongoose.model('Play', CustomSchema);

module.exports = Custom;
