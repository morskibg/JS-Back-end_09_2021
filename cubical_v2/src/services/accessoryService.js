const Accessory = require('../models/Accessory');

function addAccessory(name, description, imageUrl) {
	const newAccessory = new Accessory({
		name, description, imageUrl,
	});
	return newAccessory.save();
}

const getAccessoryById = (id) => Accessory.findById(id).lean();

const getAllAccessories = () => Accessory.find({}).lean();
// const getAllAccessoriesByCubeId = (cubeId) => Accessory.find({}).lean();

async function attachCubeToAccessory(cubeId, accessoryId) {
	Accessory.findById(accessoryId)
		.then((accessory) => {
			if (!accessory.cubes.includes(cubeId)) {
				accessory.cubes.push(cubeId);
			}
			return accessory.save();
		})
		.catch((err) => console.log(err));
}

const services = {
	addAccessory,
	getAccessoryById,
	getAllAccessories,
	attachCubeToAccessory,
};
module.exports = services;
