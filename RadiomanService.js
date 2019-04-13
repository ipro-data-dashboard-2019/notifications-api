// manages the polling and retrieval of the notifications
// returns the notificaitons to the NotificationManager
// a radioman notification is a new incident
const request = require('request');
const parseString = require('xml2js').parseString;

const INCIDENTS_URL = 'http://www.radioman911.com/pages/CAD/incidents/incidents.php';
const INCIDENT_INFO_URL = 'http://www.radioman911.com/pages/CAD/details1.php?inci_num=';

const RADIOMAN_URL_ID = 'radioman';

//const RadiomanNotification = require('./models/RadiomanNotification')(mongoose);

module.exports = class RadiomanService {

    constructor(setup) {
        // Akward, but i cant figure out a global variable syntax
        this.RadiomanNotification = require('./models/RadiomanNotification')(setup);
    }

    purge() {
        this.RadiomanNotification.deleteMany({}, (err) => {
            
        })
    }

    getModel() {
        return this.RadiomanNotification;
    }

    getURLID() {
        return RADIOMAN_URL_ID;
    }

    // Begin the timer, periodically log the new incidents to the manager
    // We have to do the duplication checking here too
    begin() {

        // Repeat every 5 seconds
        setInterval(this.tick.bind(this), 60000);
    }

    tick() {
        // Retrieve all incident reports and enumerate through them
        this.getFullIncidentsList(async (list) => {

            for (var i = 0; i < list.length; i++) {
                var elem = list[i];

                // Create the Notification
                const n = new this.RadiomanNotification(elem);

                await this.RadiomanNotification.countDocuments({rid: n.rid}, (err, count) => { 
                    
                    // Notification exists, do not save or report
                    if(count > 0){
                        //document exists });
                    }

                    // New Notificaiton, report and save
                    else {
                        n.save();
                    }

                }); 
            }
        });
    }

    getFullIncidentsList(callback) {

        request(INCIDENTS_URL, (error, response, body) => {

           parseString(body, function (err, result) {
         
               const year = new Date().getFullYear();

               const list = result.ics.i.map((item) => {
                   return {
                       rid: parseInt(item.id),
                       notes_url: INCIDENT_INFO_URL + year + '-' + item.id,
                       date: item.d,
                       time: item.t,
                       city: item.c,
                       address: item.a,
                       level: item.l,
                       calltype: item.e,
                       agency: item.f,
                       dispatcher: item.w
                   }
               })

               callback(list.sort((a, b) => a.rid - b.rid));
           });
       });
   }
}