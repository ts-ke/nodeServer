const util = require('./util.js');
const { validToken } = util;
function validateUser(req, res, next) {
	const auth = req.headers.authorization;
	if (!auth || !validToken(auth)) {
		res.status(401);
		res.json({
			success: false,
			message: 'Unauthorized',
		});
		return;
	}
	next();
}

exports.validateUser = validateUser;
