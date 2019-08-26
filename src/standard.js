const util = require('./util.js');
const { validToken } = util;
function validateUser(req, res, next) {
	const auth = req.headers.authorization;
	if (!auth || !validToken(auth)) {
		res.json({
			success: false,
			message: 'Invalid request',
		});
	}
	next();
}

exports.validateUser = validateUser;
