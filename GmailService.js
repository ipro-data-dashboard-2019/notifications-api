const http = require('http');
const url = require('url');
const destroyer = require('server-destroy');

const {google} = require('googleapis');

const GMAIL_URL_ID = 'gmail';

module.exports = class GmailService {

    constructor(setup, app, onLogin) {

        this.GmailNotification = require('./models/GmailNotification')(setup);

        const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];
        this.oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.AUTH_URL
          );

        google.options({auth: this.oauth2Client});
        this.authenticate(scopes, app).then(onLogin)
    }

    async begin() {

      this.gmail = google.gmail({
        version: 'v1',
        auth: this.oauth2Client,
      });

      setInterval(this.tick.bind(this), 60000);
    }

    async tick() {
      const res = await this.gmail.users.messages.list({userId: 'me', maxResults: 20, q: 'in:inbox'});
      var ids = res.data.messages;

      for (var i = 0; i < ids.length; i++) {
        const  id = ids[i].id;

        await this.GmailNotification.countDocuments({mid: id}, async (err, count) => { 
                    
          // Notification exists, do not save or report
          if(count > 0){
              //document exists
              //console.log('Skipping: ' + id)
          }

          // New Notificaiton, create and save
          else {
            //console.log('Adding: ' + id)
            const full = await this.gmail.users.messages.get({userId: 'me', id: id, format: 'full'});
                    
            var notif = new this.GmailNotification({
              mid: id,
              snippet: full.data.snippet,
              body: this.flattenPlainText(full.data.payload),
              subject: full.data.payload.headers.find(i => i.name == "Subject").value,
              from: full.data.payload.headers.find(i => i.name == "From").value
            })

            notif.save();
          }
        }); 
      }
    }

    // Return big string paragraph. Very limited. Only works for plaintext
    flattenPlainText(part) {
      var content = "";
      if (part.mimeType == 'text/plain') {

        let buff = new Buffer(part.body.data, 'base64');  
        let text = buff.toString('ascii');

        return text + "\n"; // might need to encode this to UTF8 or otherwise?
      }

      else if (part.hasOwnProperty('parts')) {
        for (var i = 0; i < part.parts.length; i++) {
          content += this.flattenPlainText(part.parts[i]) + "\n";
        }
        return content;
      }

      else {

      }

      return "";
    }

    async authenticate(scopes, app) {
        return new Promise((resolve, reject) => {
          // grab the url that will be used for authorization
          const authorizeUrl = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes.join(' '),
          });
          console.log('Authenticate with URL: ' + authorizeUrl)

          app.get("/auth/", async (req, resp) => {
            resp.end('Authentication successful! Please return to the console.');
            const {tokens} = await this.oauth2Client.getToken(req.query.code);

            this.oauth2Client.credentials = tokens;
            resolve();
          })
        });
      }

    purge() {
        this.GmailNotification.deleteMany({}, (err) => {
            
        })
    }

    getModel() {
        return this.GmailNotification;
    }

    getURLID() {
        return GMAIL_URL_ID;
    }
}