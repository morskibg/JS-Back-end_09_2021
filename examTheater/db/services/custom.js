const Custom = require("../models/Custom")

// check if these are good.

module.exports = {
	getAllModelType: async () => await Custom.find({}),
	create: async entry => await new Custom(entry).save(),
	getById: async id => await Custom.findById(id).lean(),
	getByCustom: async custom => await Custom.find({custom}).lean(),
	getByIdPopulated: async id => await Custom.findById(id).populate('users').lean(),
	getByIdPopulatedMod: async (id,propName) => await Custom.findById(id).populate(propName).lean(),
	deleteById: async id => await Custom.findByIdAndDelete(id),
	updateById: async (id, updated) => await Custom.findByIdAndUpdate(id, updated, { runValidators: true }),
	
	getAll: async (query) => {
		let custom = await Custom.find({isPublic: true}).lean();
		if (query.search) {
			custom = custom.filter((x) => x.title.toLowerCase().includes(query.search));      
		}		
		return custom
	}
	// ADD CUSTOMS SERVICES
}
