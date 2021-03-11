const Sauce = require("../models/sauce");
const fs = require("fs");


exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
	});
	sauce.save()
		.then(() => res.status(201).json({ message: "La sauce a été créée !" }))
		.catch((error) => res.status(400).json({ error }));
};


exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }))
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))
};

exports.modifySauce = (req, res, next) => {
	const sauceObject = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
		  }
		: { ...req.body };
	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
		.then(() => res.status(200).json({ message: "La sauce a bien été modifiée !" }))
		.catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: "La sauce a bien été supprimée !" }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(400).json({ error }));
	};


	exports.like = (req, res, next) => {
		const likes = req.body.like;
  if (likes === 1) {
    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } })
      .then(() => res.status(200).json({ message: 'Likée' }))
      .catch((error) => res.status(400).json({ error }));
  } else if (likes === -1) {
    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } })
      .then(() => res.status(200).json({ message: 'Dislikée' }))
      .catch((error) => res.status(400).json({ error }));
  } else if (likes === 0) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } })
            .then(() => res.status(200).json({ message: "Un like en moins" }))
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } })
            .then(() => res.status(200).json({ message: "Un dislike en moins"}))
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};
