const Seat = require('../models/Seat');

module.exports = {
  getAll: () => Seat.find({}).lean(),
  create: async entry => new Seat(entry).save(),
};
