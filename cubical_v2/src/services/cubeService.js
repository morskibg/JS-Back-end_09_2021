const Cube = require('../models/Cube');

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

function addCube(name, description, imageUrl, difficultyLevel) {
	const newCube = new Cube({
		name, description, imageUrl, difficultyLevel,
	});
	return newCube.save();
}

async function attachAccessoryToCube(cubeId, accessoryId) {
	Cube.findById(cubeId)
		.then((cube) => {
			if (!cube.accessories.includes(accessoryId)) {
				cube.accessories.push(accessoryId);
			}
			return cube.save();
		})
		.catch((err) => console.log(err));
}

const services = {
	getAll,
	addCube,
	getCubeById,
	attachAccessoryToCube,
};
module.exports = services;
