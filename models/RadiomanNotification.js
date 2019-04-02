module.exports = (setup) => {
    
    const radiomanSchema = new setup.mongoose.Schema({
        rid: Number,
        notes_url: String,
        date: String,
        time: String,
        city: String,
        address: String,
        level: String,
        calltype: String,
        agency: String,
        dispatcher: String
    });

    radiomanSchema.plugin(setup.autoIncrement.plugin, 'RadiomanNotification');

    const RadiomanNotification = setup.mongoose.model('RadiomanNotification', radiomanSchema);
    return RadiomanNotification;
}