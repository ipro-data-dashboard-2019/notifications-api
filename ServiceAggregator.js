module.exports = class NotificationsManager {

    // Setup and manage server
    constructor(app, services) {
        this.services = services;

        for(var i = 0; i < services.length; i++) {
            const s = services[i];
            const url_id = s.getURLID();
            const model = s.getModel();

            app.post('/' + url_id + '/', async function (req, res) {
                let results = [];

                await model.find({}, (err, matches) => {
                    results = matches;
                }).sort({_id: 1})
                
                return res.send(results);
            });
            
            app.post('/' + url_id + '/last/:notifnum', async function (req, res) {
                const notifnum = parseInt(req.params.notifnum);
            
                if (isNaN(notifnum)) {
                    return res.send('Not a valid integer');
                }
            
                let results = [];

                await model.find({}, (err, matches) => {
                    results = matches;
                }).sort({_id: -1}).limit(notifnum)
                
                return res.send(results);
            });
              
            app.post('/' + url_id + '/since/:sinceid', async function (req, res) {
                const since = parseInt(req.params.sinceid);
            
                if (isNaN(since)) {
                    return res.send('Not a valid integer');
                }
                let results = [];

                await model.find({_id: {$gt: since}}, (err, matches) => {
                    results = matches;
                }).sort({_id: -1});
                
                return res.send(results);

            });

            // Set up all the different endpoints for every service
        }
    }
}

