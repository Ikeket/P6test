const express = require('express');


const app = express();

app.use((req, res) => {
    res.json({ message: 'La requête a bien été reçu via app.js'})
})

module.exports = app;
