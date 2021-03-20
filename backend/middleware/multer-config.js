const multer = require('multer');

const MIME_TYPES = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png',
};

// FR : gère la création du nom de l'image et de son extension en png ou jpg
// EN : manages the creation of the name of the picture and its extension in png or jpg
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'images');
	},
	filename: (req, file, callback) => {
		const name = file.originalname.split(' ').join('_');
		const extension = MIME_TYPES[file.mimetype];
		callback(null, name + Date.now() + '.' + extension);
	},
});

module.exports = multer({ storage: storage }).single('image');
