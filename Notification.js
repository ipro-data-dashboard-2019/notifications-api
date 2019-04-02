const notif = class Notification {
    constructor(type, content) {
        this.type = type;
        this.content = content;
    }
}
notif.TWITTER = "Twitter";
notif.RADIOMAN = "Radioman";
notif.SMART911 = "Smart911";
notif.IPN = "IPN";

module.exports = notif;