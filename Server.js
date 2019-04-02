const express = require('express');
const app = express();

const Notification = require('./Notification');
const ServiceAggregator = require('./ServiceAggregator');

const RadiomanService = require('./RadiomanService');

// Set up server
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});
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

app.listen(3001);

