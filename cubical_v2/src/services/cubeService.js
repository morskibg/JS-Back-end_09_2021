const Cube = require('../models/Cube');
const User = require('../models/User');

async function getAll(query) {
	let cube = await Cube.find({}).lean();

	if (query.search) {
		cube = cube.filter((x) => x.name.toLowerCase().includes(query.search));
	}

	if (query.from) {
		console.log(query.from);
		cube = cube.filter((x) => Number(x.difficultyLevel) >= query.from);
		console.log('cube: ', cube);
	}

	if (query.to) {
		cube = cube.filter((x) => Number(x.difficultyLevel) <= query.to);
	}

	return cube;
}

// const getAll = () => Cube.find({}).lean();

const getCubeById = (id) => Cube.findById(id).populate('accessories').lean();

async function updateCubeById(id, cubeData) {
	const {
		name, description, imageUrl, difficultyLevel,
	} = cubeData;
	await Cube.findOneAndUpdate({ _id: id }, {
		name, description, imageUrl, difficultyLevel,
	});
}

async function deleteCubeById(id) {
	await Cube.findOneAndDelete({ _id: id });
}

async function addCube(name, description, imageUrl, difficultyLevel, creatorId) {
	const creator = await User.findById(creatorId);
	const newCube = new Cube({
		name, description, imageUrl, difficultyLevel, creator, creatorId,
	});
	return newCube.save();
}

// function addCube(name, description, imageUrl, difficultyLevel, creatorId) {
// 	User.findById(creatorId)
// 		.then((creator) => {
// 			const newCube = new Cube({
// 				name, description, imageUrl, difficultyLevel, creator, creatorId,
// 			});
// 			return newCube.save();
// 		});
// }

async function attachAccessoryToCube(cubeId, accessoryId) {
	Cube.findById(cubeId)
		.then((cube) => {
			if (!cube.accessories.includes(accessoryId)) {
				cube.accessories.push(accessoryId);
				cube.save();
				console.log('ccccccccccccc');
			}
		})
		.catch((err) => console.log(err));
}

// async function isCreator(userId, cubeId) {
// 	const currCube = await Cube.findById(cubeId);
// 	return currCube.creatorId === userId;
// }

const services = {
	getAll,
	addCube,
	getCubeById,
	attachAccessoryToCube,
	updateCubeById,
	deleteCubeById,
};
module.exports = services;
