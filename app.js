// INITIALIZATION
const config = require('./config');

// MONGODB & MONGOOSE SETUP
const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(config.localMongoDB + '/SPSDB?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const express = require('express');


const app = express();
app.use(express.static('public'));
app.use(express.json());

const employeeRoute = require('./routes/EmployeeRoute');
const shiftRoute = require('./routes/Shiftroute');
app.use('/api/employees', employeeRoute);
app.use('/api/shifts', shiftRoute);
app.use('/api/updateShift', shiftRoute);


// START THE SERVER
const port = process.env.PORT || config.localPort;
app.listen(port);
console.log('Listening on port ' + port + ' ...');

module.exports = mongoose;







