const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema({
	userId: { type: String, required: true },
	name: { type: String, required: true },
	manuffacturer: { type: String, required: true },
	description: { type: String, required: true },
	mainPepper: { type: String, required: true },
	imageUrl: { type: String, required: true },
	heat: { type: String, required: true },
	dislikes: { type: Number, required: false, default: 0 },
	dislikes: { type: Number, required: false, default: 0 },
	usersLiked: { type: [String], required: false },
	usersDislikes: { type: [String], required: false }
});

module.exports = mongoose.model("Thing", thingSchema);