/* eslint-disable no-tabs */
const Accessory = require('../models/Accessory');

function addAccessory(name, description, imageUrl) {
	const newAccessory = new Accessory({
		name, description, imageUrl,
	});
	return newAccessory.save();
}

const getAccessoryById = (id) => Accessory.findById(id).lean();

const getAvailableAccessories = (cubeAccesoriesIds) => Accessory
	.find({ _id: { $nin: cubeAccesoriesIds } })
	.lean();
// const getAvailableAccessories = (cubeId) => Accessory.find().where('cubes').equals([]).lean();

async function attachCubeToAccessory(cubeId, accessoryId) {
	const accessory = await Accessory.findById(accessoryId);
	if (!accessory.cubes.includes(cubeId)) {
		accessory.cubes.push(cubeId);
		accessory.save();
		console.log('ffffffffffffff');
	}
	// Accessory.findById(accessoryId)
	// 	.then((accessory) => {
	// 		if (!accessory.cubes.includes(cubeId)) {
	// 			accessory.cubes.push(cubeId);
	// 			accessory.save();
	// 		}
	// 	})
	// 	.catch((err) => console.log(err));
}

const services = {
	addAccessory,
	getAccessoryById,
	getAvailableAccessories,
	attachCubeToAccessory,
};
module.exports = services;
