const express = require('express');
var bodyParser = require('body-parser');
const app = express();

const ServiceAggregator = require('./ServiceAggregator');

const RadiomanService = require('./RadiomanService');
const GmailService = require('./GmailService');
const SMSSerice = require('./SMSService');

// Set up server
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const MONGO_DEV = 'mongodb://localhost:27017/test'
mongoose.connect(process.env.MONGODB_URI || MONGO_DEV , {useNewUrlParser: true});
autoIncrement.initialize(mongoose);

const setup = {mongoose: mongoose, autoIncrement: autoIncrement}

app.use(bodyParser.urlencoded({extended: false}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

console.log("LISTENING ON: " + process.env.PORT);
app.listen(process.env.PORT);

/**
 * RADIOMAN
 */
// const rs = new RadiomanService(setup);
// //rs.purge(); //DUMP THE DATABASE
// rs.begin();

/**
 * GMAIL
 */
// const gs = new GmailService(setup, app, _ => {
//     gs.begin();
// });

const sms = new SMSSerice(setup, app);


// // Aggregate services and setup endpoints for them
const serviceAggregator = new ServiceAggregator(app, [sms]);