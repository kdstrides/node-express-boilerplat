const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require("../../models/user");
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

router.post("/login",(req, res, next) =>
{
    passport.authenticate('login', (err, user, info) =>
    {
        if (err) {
            return res.status(500).json({ message : err.message });
        }

        if (!user) {
            return res.status(404).json({message : info.message });
        }

        req.logIn(user, (err) =>
        {
            if (err) {
                return res.status(404).json({ message : err.message });
            }
            return res.json({'status':'ok', user : user});
        });
    })(req, res, next);
});

router.get("/checkLogin", (req, res, next) => {
    if(typeof req.session.passport != "undefined" && typeof req.session.passport.user != "undefined")
        res.status(200).send({ 'status':'ok', user : req.session.passport.user });
    else
        res.status(401).send({ message : "You are not loggedin user." });
});

router.get('/logout', (req, res, next) =>
{
    req.logOut();
    return res.send({ message : "Success." });
});

router.get('/create_user', (req, res) =>
{
    User.find({ deleted : false }, (err, users) =>
    {
        if(users.length == 0)
        {
            User.create({
                name : "Dipesh Parmar",
                email    : 'dipeshbeckham@gmail.com',
                password : new User().generateHash("dipesh"),
                is_admin : 1,
                deleted  : false
            }, (err, users, datas) =>
            {
                return res.send("User saved!");
            });
        }
        else
        {
            return res.send("User Saved");
        }
    });
});

router.post('/forgot_password', function (req, res, next)
{
    async.waterfall([
        (done) => {
            crypto.randomBytes(20, (err, buf) => {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        (token, done) => {
            User.findOne({ deleted : false, email: req.body.email }, (err, user) => {
                if (!user) {
                    return res.status(404).json({ message : 'No account with that email address exists.' });
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;

                user.save((err) => {
                    done(err, token, user);
                });
            });
        },
        (token, user, done) => {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                host: 'smtp.gmail.com',
                secureConnection: false,
                port: 465,
                auth: {
                    user: '**********@gmail.com',
                    pass: '**********'
                }
            });
            var mailOptions = {
                to: user.email,
                from: global.config.app_email,
                subject: global.config.app_name +' Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, (err) => {
                res.json({ message : 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
                done(err, 'done');
            });
        }
    ], (err) => {
        if (err)
            return next(err);
        return res.status(404).json({ message : 'Error processing reset password. Please try again.' });
    });
});

router.get('/reset/:token', (req, res) =>
{
    User.findOne({deleted : false, resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, (err, user) =>
    {
        if (!user) {
            return res.status(400).json({ message : 'Password reset token is invalid or has expired.' });
        }
        return res.json({
            _id : user._id,
            email : user.email,
            resetPasswordToken : user.resetPasswordToken
        });
    });
});

router.post('/reset/:token', (req, res) =>
{
    async.waterfall([
        (done) => {
            User.findOne({deleted : false, resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, (err, user) =>
            {
                if (!user) {
                    return res.status(400).json({ message : 'Password reset token is invalid or has expired.' });
                }

                user.password = new User().generateHash(req.body.password);
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function (err) {
                    req.logIn(user, (err) => {
                        done(err, user);
                    });
                });
            });
        },
        (user, done) => {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                host: 'smtp.gmail.com',
                secureConnection: false,
                port: 465,
                auth: {
                    user: '**********@gmail.com',
                    pass: '**********'
                }
            });
            var mailOptions = {
                to: user.email,
                from: global.config.app_email,
                subject: global.config.app_name + ' : Your password has been changed',
                text: 'Hello,\n\n' +
                        'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, (err) => {
                res.json({ message : 'Success! Your password has been changed.' });
                done(err);
            });
        }
    ], (err) => {
        if (err)
            return next(err);

        return res.status(404).json({ message : 'Error processing reset password. Please try again.' });
    });
});

module.exports = router;
