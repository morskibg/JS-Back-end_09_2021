const Custom = require('../models/Custom');

// check if these are good.
module.exports = {
  getAll: async () => await Custom.find({}).lean(),
  create: async entry => await new Custom(entry).save(),
  getById: async id => await Custom.findById(id).lean(),
  getByIdPopulated: async id =>
    await Custom.findById(id).populate('buddies').lean(),
  deleteById: async id => await Custom.findByIdAndDelete(id),
  updateById: async (id, updated) =>
    await Custom.findByIdAndUpdate(id, updated, { runValidators: true }),
  // ADD CUSTOMS SERVICES
  getByTitle: title => {
    const pattern = new RegExp(`^${title}$`, 'i');
    return Custom.findOne({ title: { $regex: pattern } });
  },

  ///// get all with search query
  // getAll: async (query) => {
  // 	let custom = await Custom.find({}).lean();
  // 	if (query.search) {
  // 		custom = custom.filter((x) => x.title.toLowerCase().includes(query.search));
  // 	}
  // 	return custom
  // }

  ///// get populated with prop name
  getByIdPopulatedMod: async (id, propName) =>
    await Custom.findById(id).populate(propName).lean(),

  getSortedByLikes: async () => {
    const allPlays = await Custom.find({}).lean();
    return allPlays.sort((x, y) => x.likers.length - y.likers.length).reverse();
  },

  getSortedByTimeCreated: async isPublicOnly => {
    let allPlays = undefined;
    if (isPublicOnly) {
      allPlays = await Custom.find({ isPublic: true }).lean();
    } else {
      allPlays = await Custom.find({}).lean();
    }
    return allPlays.sort((x, y) => x.createdAt - y.createdAt).reverse();
  },
};
