const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// FR : gestion des routes login
// EN : management of router login
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
