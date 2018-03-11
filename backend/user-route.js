const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('./config');
const User = require('./user-model');

router.post('/register', (req, res, next) => {
    let newUser = new User({
        account: req.body.account,
        password: req.body.password,
        email: req.body.email,
        name: req.body.name
    });

    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({ success: false, msg: 'Register failed' });
        } else {
            res.json({ success: true, msg: 'User registered' });
        }
    });
});

router.post('/auth', (req, res, next) => {
    const account = req.body.account;
    const password = req.body.password;
    User.getUserByAccount(account, (err, user) => {
        if (err) throw err;
        if (!user) {
            res.json({ success: false, msg: 'User not found' });
        }
        User.comparePassword(password, user.password, (match) => {
            if (match) {
                const token = jwt.sign({
                    data: user
                }, config.secret, { expiresIn: '6h' });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                res.json({ success: false, msg: 'Wrong password' });
            }
        });
    });
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({ user: req.user });
});

module.exports = router;