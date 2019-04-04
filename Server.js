const express = require('express');
const app = express();

const Notification = require('./Notification');
const ServiceAggregator = require('./ServiceAggregator');

const RadiomanService = require('./RadiomanService');
const GmailService = require('./GmailService')

// Set up server
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const MONGO_DEV = 'mongodb://localhost:27017/test'
mongoose.connect(process.env.MONGODB_URI || MONGO_DEV , {useNewUrlParser: true});
autoIncrement.initialize(mongoose);

const setup = {mongoose: mongoose, autoIncrement: autoIncrement}

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
const rs = new RadiomanService(setup);
//rs.purge(); //DUMP THE DATABASE
rs.begin();

/**
 * GMAIL
 */
const gs = new GmailService(setup, app, _ => {
    gs.begin();
});


// // Aggregate services and setup endpoints for them
const serviceAggregator = new ServiceAggregator(app, [gs]);