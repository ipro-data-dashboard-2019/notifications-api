const request = require('request');

const TWITTER_URL_ID = 'twitter';
const TWITTER_API_URL = process.env.TWITTER_URL;
const TWITTER_HANDLES = ['@RedCross','@ChicagoFireMap','@NWSChicago','@MABASIllinois','@LinComm1','@SSFPD','@ChicagoPDAirSea','@BureauCoEMA','@McHenryEMA','@CFD_FD','@NapervilleProFF','@RockfordFire','@KaneILScanner','@CFGScanner','@LMCScanner','@ChicagoFireDept','@ChicagoFireDep','@NotifyChicago','@chicagoalerts','@MABAS115','@ICERN_ALERT','@NIFGALERTS','@Radioman911','@CFDMedia','@ChicagoRedCross'];
//const TWITTER_HANDLES = ['@RedCross', '@Radioman911'];

module.exports = class TwitterService {

    constructor(setup) {

        this.TwitterNotification = require('./models/TwitterNotification')(setup);
    }

    async begin() {

      setInterval(this.tick.bind(this), 60000);
    }

    tick() {
        console.log('tick');
        var self = this;

        request(TWITTER_API_URL + "scrape_accounts?count=3&accounts=" + TWITTER_HANDLES.join(','), async function (error, response, body) {
            
            console.error('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

            var payload = JSON.parse(body);

            for (var i = 0; i < TWITTER_HANDLES.length; i++) {
                const handle = TWITTER_HANDLES[i];
                const tweet_list = payload[handle];

                for (var j = 0; j < tweet_list.length; j++) {
                    const tweet = tweet_list[j];
 
                    await self.TwitterNotification.countDocuments({tid: tweet.id_str}, async (err, count) => { 
                    
                        // Notification exists, do not save or report
                        if(count > 0){
                            //document exists
                            //console.log('Skipping: ' + tweet.id_str);
                        }
              
                        // New Notificaiton, create and save
                        else {
                            console.log('Adding: ' + tweet.id_str);

                            const notif = new self.TwitterNotification({
                                tid: tweet.id_str,
                                user_name: tweet.user.name,
                                user_handle: tweet.user.screen_name,
                                // CAUTION: These tweets are not being sanitized at all
                                text: tweet.text,
                                favorite_count: tweet.favorite_count,
                                retweet_count: tweet.retweet_count
                            })
                            notif.save();

                        }
                    });
                }
            }
        });
    }

    purge() {
        this.TwitterNotification.deleteMany({}, (err) => {
            
        })
    }

    getModel() {
        return this.TwitterNotification;
    }

    getURLID() {
        return TWITTER_URL_ID;
    }
}