// INITIALIZATION
const config = require('./config');

// MONGODB & MONGOOSE SETUP
const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(config.localMongoDB + '/SPSDB?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
// Test Push
const express = require('express');
const controller = require('./controllers/Controller');

const app = express();
app.use(express.static('public'));
app.use(express.json());

// START THE SERVER
const port = process.env.PORT || config.localPort;
app.listen(port);
console.log('Listening on port ' + port + ' ...');

// controller.init();
module.exports = app;






