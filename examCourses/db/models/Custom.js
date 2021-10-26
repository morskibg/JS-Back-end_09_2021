const mongoose = require('mongoose');

const CustomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  courseImage: { type: String, required: true },
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

// CHANGE THE NAME
const Custom = mongoose.model('Course', CustomSchema);

module.exports = Custom;
