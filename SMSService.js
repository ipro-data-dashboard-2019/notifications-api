const SMS_URL_ID = 'text';

module.exports = class SMSService {

    constructor(setup, app) {

        this.SMSNotification = require('./models/SMSNotification')(setup);
        app.post('/sms', (req, resp) => {
            console.log('new message');
            const msg = req.body;
            const notif = new this.SMSNotification({
                mid: msg.MessageSid,
                from: msg.From,
                body: msg.Body
            })
            notif.save();
            return 'Completed';
        })

    }

    purge() {
        this.SMSNotification.deleteMany({}, (err) => {
            
        })
    }

    getModel() {
        return this.SMSNotification;
    }

    getURLID() {
        return SMS_URL_ID;
    }
}