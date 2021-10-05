const jwt = require('jsonwebtoken');
const { cookieName, secret } = require('../config/config');

module.exports = function () {
	return (req, res, next) => {
		const token = req.cookies[cookieName];
		if (token) {
			jwt.verify(token, secret, (err, decoded) => {
				if (err) {
					req.clearCookie(cookieName);
				} else {
					req.user = decoded;
					res.locals.user = decoded;
					res.locals.isAuthenticated = true;
				}
			});
		}
		next();
	};
};
