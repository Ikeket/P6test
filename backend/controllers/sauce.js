const Sauce = require('../models/sauce');
const fs = require('fs');

// FR : création de la sauce
// EN : creation of the sauce
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	// FR : initialise une nouvelle sauce sur la base du modèle sauceObject
	// EN : initialize a new sauce based on the sauceObject template
	const sauce = new Sauce({
		...sauceObject,
		// FR : création de l'url de l'image avec un rendu type : http://localhost:4200/images/monimage.png
		// EN : creation of the picture url with a typical rending : http://localhost:4200/images/monimage.png
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
	});
	sauce
		.save()
		.then(() => res.status(201).json({ message: 'La sauce a été créée !' }))
		.catch((error) => res.status(400).json({ error }));
};

// FR : permet d'obtenir une seule sauce en fonction de son id
// EN : allows to obtain a single sauce according to its id
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => res.status(400).json({ error }));
};

// FR : permet d'obtenir toutes les sauces
// EN : allow to obtain all sauces
exports.getAllSauces = (req, res, next) => {
	Sauce.find()
		.then((sauces) => res.status(200).json(sauces))
		.catch((error) => res.status(400).json({ error }));
};

// FR : permet de modifier une sauce si on en est le propriétaire grâce à isOwner.js
// EN : allows you to modify a sauce if you are the owner with isOwner.js
exports.modifySauce = (req, res, next) => {
	// FR : vérifie si l'on modifie l'image
	// EN : check if we modify the picture
	if (req.file) {
		Sauce.findOne({ _id: req.params.id })
			.then((sauce) => {
				const filename = sauce.imageUrl.split('/images/')[1];
				// FR : supprime l'image de la sauce
				// EN : delete the picture of the sauce
				fs.unlink(`images/${filename}`, () => {
					const sauceObject = {
						...JSON.parse(req.body.sauce),
						imageUrl: `${req.protocol}://${req.get('host')}/images/${
							req.file.filename
						}`,
					};
					// FR : renvoie l'objet Sauce avec la nouvelle image
					// EN : return the object Sauce with the new picture
					Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
						.then(() =>
							res.status(200).json({ message: 'La sauce a bien été modifiée !' })
						)
						.catch((error) => res.status(400).json({ error }));
				});
			})
			.catch((error) => res.status(500).json({ error }));
	}
	// FR : si la modification ne concerne pas l'image
	// EN : if the modification don't concern the picture
	else {
		const sauceObject = { ...req.body };
		Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
			.then(() => res.status(200).json({ message: 'La sauce a bien été modifiée !' }))
			.catch((error) => res.status(400).json({ error }));
	}
};

// FR : permet de supprimer la sauce
// EN : allows to remove the sauce
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split('/images/')[1];
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() =>
						res.status(200).json({ message: 'La sauce a bien été supprimée !' })
					)
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(400).json({ error }));
};

// FR : gestion des likes avec vérification des utilisateurs ayant déjà liké ou non
// EN : likes management with verification of user who have already liked or disliked
exports.like = (req, res, next) => {
	const likes = req.body.like;
	if (likes === 1) {
		Sauce.updateOne(
			{ _id: req.params.id },
			{ $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
		)
			.then(() => res.status(200).json({ message: 'Likée' }))
			.catch((error) => res.status(400).json({ error }));
	} else if (likes === -1) {
		Sauce.updateOne(
			{ _id: req.params.id },
			{ $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
		)
			.then(() => res.status(200).json({ message: 'Dislikée' }))
			.catch((error) => res.status(400).json({ error }));
	} else if (likes === 0) {
		Sauce.findOne({ _id: req.params.id })
			.then((sauce) => {
				if (sauce.usersLiked.includes(req.body.userId)) {
					Sauce.updateOne(
						{ _id: req.params.id },
						{ $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
					)
						.then(() => res.status(200).json({ message: 'Un like en moins' }))
						.catch((error) => res.status(400).json({ error }));
				} else if (sauce.usersDisliked.includes(req.body.userId)) {
					Sauce.updateOne(
						{ _id: req.params.id },
						{ $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } }
					)
						.then(() => res.status(200).json({ message: 'Un dislike en moins' }))
						.catch((error) => res.status(400).json({ error }));
				}
			})
			.catch((error) => res.status(400).json({ error }));
	}
};
