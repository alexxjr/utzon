// INITIALIZATION
// MONGOOSE
const mongoose = require('mongoose');
mongoose.promise = Promise;
// Test Push
const express = require('express');
const controller = require('./controllers/Controller');

const app = express();
app.use(express.static('public'));
app.use(express.json());

// START THE SERVER
const port = process.env.PORT || 9119;
app.listen(port);
console.log('Listening on port ' + port + ' ...');

let test = controller.createEmployee('0123456789','John','John@mail.com','12345678');

console.log(test);



