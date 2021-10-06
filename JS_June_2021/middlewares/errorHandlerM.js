module.exports = (() => (err, req, res, next) =>{
	console.log('dddddddddddddddddddd');
	console.log(err);
	next()
});

// module.exports = () => (req, res, next) => {
// 	try {
// 		console.log(req.url);
// 	} catch (error) {
// 		console.log(error);
// 	}
// 	next();
// };