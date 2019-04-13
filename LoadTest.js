const request = require('request');

const endpoints = ['twitter', 'text', 'gmail', 'radioman'];
const modes = ['/', '/last/:id', '/since/:id'];
const test_url = 'http://ipro-redcross.herokuapp.com/';

// Hit x times for every endpoint/mode combo
const load_test_num = 10;

async function load_test() {
    for (let i = 0; i < endpoints.length; i++) {
        for (let j = 0; j < modes.length; j++) {
            for (let k = 0; k < load_test_num; k++) {
                let load_url = test_url + endpoints[i];
                let mode = modes[j];

                if (mode.includes(':id')) {
                    mode = mode.replace(':id', Math.floor(Math.random() * 100))
                }
                load_url += mode;

                await request.post(load_url, function (error, response, body) {
                    if (response && response.statusCode !== 200) {
                        console.log(load_url);
                        console.error('error:', error); // Print the error if one occurred
                        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                        console.log();
                    }
                });
            }
        }
    }
}

load_test();