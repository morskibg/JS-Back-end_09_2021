const mongoose = require('mongoose');

const CustomSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  origin: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  image: { type: String, required: true },
  isPublic: { type: Boolean },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bookers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  seats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seat' }],
});

// CHANGE THE NAME
const Custom = mongoose.model('Flight', CustomSchema);

module.exports = Custom;
