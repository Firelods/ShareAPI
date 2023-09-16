const config = require('../config/auth.config');
const db = require("../models");
const User = db.user;
const passport = require("passport");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });
    user.save((err, user) => {
        console.log(err);
        console.log(user);
        if (err) {
            res.status(500).send({
                message: err
            });
            return;
        }

        user.save(err => {
            if (err) {
                res.status(500).send({
                    message: err
                });
                return;
            }
            console.log("User saved successfully!");
            res.send({
                message: "User was registered successfully!"
            });
        });
    });
}

exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username
    })
        .exec((err, user) => {
            if (err) {
                res.status(500).send({
                    message: err
                });
                return;
            }
            if (!user) {
                console.log(req.body.username);
                console.log(user)
                return res.status(404).send({
                    message: "User Not found."
                });
            }
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }
            var token = jwt.sign({
                id: user.id
            }, config.secret, {
                expiresIn: 600 // 24 hours
            });
            User.updateOne({ email: user.email }, { session: token }).exec((err, user) => {
                console.log(user);
                console.log(err);
            });
            console.log("User signed in successfully!");
            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                accessToken: token
            });
        });
};

exports.google = passport.authenticate('google', { scope: ['openid', 'email', 'profile'] });

exports.error = function (req, res) {
    console.log(req.session.messages);
    res.send("Error logging in.");
};

exports.googleCallback = passport.authenticate('google', { failureRedirect: '/api/auth/error', failureMessage: true }),
    function (req, res) {
        console.log("User logged in successfully!");
        res.redirect('/');
    };