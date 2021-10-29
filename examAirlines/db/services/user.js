const User = require('../models/User.js');

// check if these are good.
module.exports = {
  getAll: () => User.find({}).lean(),
  createNew: async userData => await new User(userData).save(),

  getByEmail: async email => await User.findOne({ email }).lean(),

  //  From Victor find by usernam case insensitive
  getByUsername: username => {
    const pattern = new RegExp(`^${username}$`, 'i');
    return User.findOne({ username: { $regex: pattern } });
  },

  update: async (_id, updated) => await User.findByIdAndUpdate(_id, updated),

  getById: async _id =>
    await User.findById(_id).populate('tripsHistory').lean(),

  addFlight: async (flightId, userId) => {
    const user = await User.findOne({ _id: userId });
    console.log(user);
    user.flightsCreated.push(flightId);

    user.save();
  },
};
