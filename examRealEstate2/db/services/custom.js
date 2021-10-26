const Custom = require('../models/Custom');

// check if these are good.
module.exports = {
  getAll: async () => await Custom.find({}).lean(),
  getAllOrderAndLimit: async limit =>
    await Custom.find({}).sort({ createdAt: -1 }).limit(limit).lean(),
  create: async entry => await new Custom(entry).save(),
  getById: async id => await Custom.findById(id).lean(),
  getByIdPopulated: async id =>
    await Custom.findById(id).populate('buddies').lean(),
  deleteById: async id => await Custom.findByIdAndDelete(id),
  updateById: async (id, updated) =>
    await Custom.findByIdAndUpdate(id, updated, { runValidators: true }),
  // ADD CUSTOMS SERVICES

  ///// get all with search query
  // getFilteredByType: async query => {
  //   let custom = await Custom.find({}).lean();
  //   if (query.search) {
  //     custom = custom.filter(x => x.title.toLowerCase().includes(query.search));
  //   }
  //   return custom;
  // },

  // Searching by REGEX in pron case insensitive
  getFilteredByType: async query => {
    return await Custom.find({
      type: { $regex: `${query}`, $options: 'i' },
    }).lean();
  },

  ///// get populated with prop name
  // getByIdPopulatedMod: async (id, propName) =>
  //   await Custom.findById(id).populate(propName),

  composeDetailsHouseObj: async (houseId, userId) => {
    let house = await Custom.findById(houseId).populate('tenants');
    const tenantsList = house.tenantList();
    const isOwn = house.owner.equals(userId);
    const alreadyRented = house.tenants.some(x => x._id.equals(userId));
    const isAvailable = house.qty > house.tenants.length;
    const qty = house.qty - house.tenants.length;
    house = house.toObject();
    return { ...house, tenantsList, isOwn, alreadyRented, isAvailable, qty };
  },
};
