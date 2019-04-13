module.exports = (setup) => {
    
    const gmailNotification = new setup.mongoose.Schema({
        mid: String,
        snippet: String,
        body: String,
        from: String,
        subject: String
    },{ timestamps: { createdAt: 'created_at'}});

    gmailNotification.plugin(setup.autoIncrement.plugin, 'GmailNotification');

    const GmailNotification = setup.mongoose.model('GmailNotification', gmailNotification);
    return GmailNotification;
}