const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const User = require('../models/user');

// FR : créé et enregistre l'utilisateur dans la base de données
// EN : create and save the user in the database
exports.signup = (req, res, next) => {
	// FR : cryptage du mot de passe avec bcrypt
	// EN : password encryption with bcrypt
	bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
			// FR : cryptage de l'email avec SHA3
			// EN : email encryption with SHA3
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

// FR : gestion du login de l'utilisateur
// EN : management of user's login
exports.login = (req, res, next) => {
	const cipherText = CryptoJS.SHA3(req.body.email).toString();
	// FR : cherche l'email correspondant au cryptage
	// EN : search the mail corresponding to the encryption
	User.findOne({
		email: cipherText,
	})
		.then((user) => {
			if (!user) {
				return res.status(401).json({ error: 'Mot de passe/utilisateur incorrect.' });
			}
			// FR : compare les mots de passe pour autoriser la connexion
			// EN : compare passwords to autorize the connexion
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
