const express = require('express');
const app = express();

const Notification = require('./Notification');
const ServiceAggregator = require('./ServiceAggregator');

const RadiomanService = require('./RadiomanService');

// Set up server
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const MONGO_DEV = 'mongodb://localhost:27017/test'
mongoose.connect(process.env.MONGODB_URL || MONGO_DEV , {useNewUrlParser: true});
autoIncrement.initialize(mongoose);

const setup = {mongoose: mongoose, autoIncrement: autoIncrement}

/**
 * RADIOMAN
 */
const rs = new RadiomanService(setup);
//rs.purge(); //DUMP THE DATABASE
rs.begin();


// Aggregate services and setup endpoints for them
const serviceAggregator = new ServiceAggregator(app, [rs]);

app.post('/test/', function (req, res) {
    console.log("received")
    return res.send('received');
});

app.listen(process.env.PORT || 3001);

