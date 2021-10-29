const mongoose = require('mongoose');

const CustomSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Business', 'Economy', 'Traveler'],
    required: true,
  },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
});

// CHANGE THE NAME
const Custom = mongoose.model('Seat', CustomSchema);

module.exports = Custom;
