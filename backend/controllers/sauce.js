const Sauce = require("../models/sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
	});
	sauce
		.save()
		.then(() => res.status(201).json({ message: "La sauce a été créée !" }))
		.catch((error) => res.status(400).json({ error }));
};


exports.like = (req, res, next) => {
    switch(req.body.like) {
    case 1:
        Sauce.updateOne({ _id: req.params.id }, {
            $inc: {likes: 1},
            $push: { usersLiked: req.body.userId },
            _id: req.params.id
        })
        .then( sauce => { res.status(201).json({ message: `Et un like de plus pour cette sauce !` }); })
        .catch((error) => { res.status(400).json({ error: error }); });
    break;

	case -1:
        Sauce.updateOne({ _id: req.params.id }, {
            $inc: {dislikes: 1},
            $push: { usersDisliked: req.body.userId },
            _id: req.params.id
        })
        .then( sauce => { res.status(201).json({ message: `Oh... vous n'avez pas aimé cette sauce.` }); })
        .catch((error) => { res.status(400).json({ error: error }); });
    break;

	default: console.log("test");
	break;
    }
}


exports.getOneSauce = (req, res, next) => {
    Sauce.findOne()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }))
};

exports.getAllSauce = (req, res, next) => {
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

exports.deleteOne = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: "La sauce a bien été supprimée !" }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(400).json({ error }));
	};
