const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];

		// FR : SECRET_TOKEN est dans le fichier .env
		// EN : SECRET_TOKEN is on .env file
		const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
		const userId = decodedToken.userId;
		if (req.body.userId && req.body.userId !== userId) {
			throw 'Invalid user ID';
		} else {
			next();
		}
	} catch {
		res.status(401).json({
			error: new Error('Invalid request!'),
		});
	}
};
