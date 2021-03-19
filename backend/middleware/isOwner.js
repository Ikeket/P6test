const jwt = require('jsonwebtoken');
const Sauce = require('../models/sauce');

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
		const userId = decodedToken.userId;

		Sauce.findOne({ _id: req.params.id })
			.then((sauce) => {
				if (userId === sauce.userId) {
					next();
				} else {
					throw 'Vous ne pouvez modifier ou supprimer la sauce.';
				}
			})
			.catch((error) => res.status(400).json({ error }));
	} catch {
		res.status(401).json({
			error: new Error('Invalid request!'),
		});
	}
};
