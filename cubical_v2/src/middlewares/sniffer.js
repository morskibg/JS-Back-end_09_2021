module.exports = () => (req, res, next) => {
	try {
		console.log(req.url);
	} catch (error) {
		console.log(error);
	}
	next();
};
