const LocalStrategy = require('passport-local').Strategy;
const User = require('../server/models/user');

module.exports = (passport, config) =>
{
    passport.serializeUser((user, done) =>
    {
        done(null, user);
    });

    passport.deserializeUser((id, done) =>
    {
        User.findById(id, (err, user) => {
            done(err, {
                _id : user._id,
                email : user.email,
                name : user.name,
                is_admin : user.is_admin
            });
        });
    });

    passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },(req, email, password, done) =>
    {
        User.findOne({ email: email }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message : 'E-mail ' + email + ' is not registered.' });
            }
            if (!user.validPassword(password, user)) {
                return done(null, false, { message : 'Invalid login attempt.' });
            }
            return done(null, {
                _id : user._id,
                email : user.email,
                name : user.name,
                is_admin : user.is_admin
            });
        });
    }));
};
