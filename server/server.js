/*
* Require necessary modules to bootstrap app.
*/

const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

let env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/*
 * Setting global config for DataBase, and Authentication
 */

global.config = require('../config/config')[env];
global.AppLbl = require('../config/constant');

global.isAuthenticated = (req, res, next) =>
{
    if (req.isAuthenticated())
        return next();

    return res.status(403).json({ message : "Not Allowed." });
};

/*
* Setting up security for session Hijacking
*/

const store = new MongoDBStore({
    uri: global.config.db,
    collection: global.config.sessionTable
});

store.on('connected', () => { store.client; });
store.on('error', (error) => { assert.ifError(error); assert.ok(false); });

/*
 * Setting global config for DataBase, Authentication and APP
 */

app.use(session({
    secret: global.config.secretKey,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 5
    },
    store: store,
    saveUninitialized: true,
    resave: false,
    name: global.config.sessionId
}));
app.use(passport.initialize());
app.use(passport.session());

require('../config/db')(global.config);
require('../config/express')(app, global.config);
require('../config/passport')(passport, global.config);
