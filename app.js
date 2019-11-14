// INITIALIZATION
// Test Push
const express = require('express');

const app = express();
app.use(express.static('public'));
app.use(express.json());

// START THE SERVER
const port = process.env.PORT || 9119;
app.listen(port);
console.log('Listening on port ' + port + ' ...');