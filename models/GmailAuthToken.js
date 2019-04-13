module.exports = (setup) => {
    
    const gmailAuthToken = new setup.mongoose.Schema({
        access_token: String,
        refresh_token: String,
        scope: String,
        token_type: String,
        expiry_date: Number
    },);

    const GmailAuthToken = setup.mongoose.model('GmailAuthToken', gmailAuthToken);
    return GmailAuthToken;
}