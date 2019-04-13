module.exports = (setup) => {
    
    const twitterNotification = new setup.mongoose.Schema({
        tid: String,
        user_name: String,
        user_handle: String,
        text: String,
        favorite_count: Number,
        retweet_count: Number
    },{ timestamps: { createdAt: 'created_at'}});

    twitterNotification.plugin(setup.autoIncrement.plugin, 'TwitterNotification');

    const TwitterNotification = setup.mongoose.model('TwitterNotification', twitterNotification);
    return TwitterNotification;
}