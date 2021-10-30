const User = require('../models/User.js');

// check if these are good.
module.exports = {
  createNew: async userData => await new User(userData).save(),

  getByEmail: async email => await User.findOne({ email }).lean(),

  //  From Victor find by usernam case insensitive
  getByUsername: async username => {
    const pattern = new RegExp(`^${username}$`, 'i');
    return await User.findOne({ username: { $regex: pattern } });
  },

  update: async (_id, updated) => await User.findByIdAndUpdate(_id, updated),

  getById: async _id =>
    await User.findById(_id).populate('tripsHistory').lean(),

  addTrip: async (tripId, userId) => {
    const user = await User.findOne({ _id: userId });
    console.log(user);
    user.tripsHistory.push(tripId);

    user.save();
  },
};
