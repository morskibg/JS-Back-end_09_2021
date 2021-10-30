const mongoose = require('mongoose');

const CustomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  keyword: { type: String, required: true },
  location: { type: String, required: true },
  dateStr: { type: String, required: true },
  createdAt: { type: Date, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  voted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rating: { type: Number, required: true, default: 0 },
});

// CHANGE THE NAME
const Custom = mongoose.model('Post', CustomSchema);

module.exports = Custom;
