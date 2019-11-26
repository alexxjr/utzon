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
const session = require('express-session');


const app = express();
app.use(session({secret: 'Utzon secret', saveUninitialized: true, resave: true}));
app.use(express.json());
app.use(express.static('public'));

const employeeRoute = require('./routes/EmployeeRoute');
const shiftRoute = require('./routes/ShiftRoute');
const loginRoute = require('./routes/LoginRoute');
app.use('/api/employees', employeeRoute);
app.use('/api/shifts', shiftRoute);
app.use('/api/login', loginRoute);


// START THE SERVER
const port = process.env.PORT || config.localPort;
app.listen(port);
console.log('Listening on port ' + port + ' ...');

module.exports = mongoose;







