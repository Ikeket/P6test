const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const User = require('../models/user');

exports.signup = (req, res, next) => {
	bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
			const cipherText = CryptoJS.SHA3(req.body.email);
			const user = new User({
				email: cipherText,
				password: hash,
			});

			user.save()
				.then(() => res.status(201).json({ message: 'Votre compte a bien été créé !' }))
				.catch((error) => res.status(400).json({ error: 'Email déjà utilisée.' }));
		})
		.catch((error) => {
			res.status(500).json({ error });
		});
};

exports.login = (req, res, next) => {
	const cipherText = CryptoJS.SHA3(req.body.email).toString();

	User.findOne({
		email: cipherText,
	})
		.then((user) => {
			if (!user) {
				return res.status(401).json({ error: 'Mot de passe/utilisateur incorrect.' });
			}
			bcrypt
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						return res
							.status(401)
							.json({ error: 'Mot de passe/utilisateur incorrect.' });
					}
					res.status(200).json({
						userId: user._id,
						token: jwt.sign({ userId: user._id }, process.env.SECRET_TOKEN, {
							expiresIn: '24h',
						}),
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => {
			res.status(500).json({ error });
		});
};
