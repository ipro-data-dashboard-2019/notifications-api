module.exports = (setup) => {
    
    const smsNotification = new setup.mongoose.Schema({
        mid: String,
        body: String,
        from: String
    },{ timestamps: { createdAt: 'created_at'}});

    smsNotification.plugin(setup.autoIncrement.plugin, 'SMSNotification');

    const SMSNotification = setup.mongoose.model('SMSNotification', smsNotification);
    return SMSNotification;
}