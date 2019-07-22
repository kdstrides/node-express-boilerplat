const mongoose = require("mongoose");

module.exports = (config) =>
{
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db);
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', () =>
    {
        console.log('DB opened :- ' + config.db);
    });
};