// FR : DOT ENV permet de ne pas donner directement les logs de notre base de données dans le code
// EN : DOT ENV allows to not give directly the log of our database in the code
require('dotenv').config();

// FR : import des différents modules, frameworks et routes utiles
// EN : import of differents modules, framworks and useful files
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const mongoose = require('mongoose');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const app = express();

// FR : permet de se connecter à MongoDB ou retourne une erreur
// EN : used to connect to MongoDB or return an error
mongoose
	.connect(process.env.DB_CONNECT, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => console.log('Connexion à MongoDB réussie !'))
	.catch(() => console.log('Connexion à MongoDB échouée !'));

// FR : sécurisation avec HELMET & mise en place des headers
// EN : securing with HELMET & setting up headers
app.use(helmet());
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
	);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

app.use(bodyParser.json());

// FR : indique à l'application quelles sont les pages qu'elle peut utiliser pour récupérer ses données
// EN : tells to the app which pages can be used to retrieve datas
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

// FR : enfin, nous exportons l'app en tant que module (à comprendre tout ce que nous avons dans le fichier app.js) pour le rendre fonctionnel dans l'ensemble du back
// EN : finally, we export the app as a module (means : all we put in app.js file) to make it functional throughout the back
module.exports = app;
