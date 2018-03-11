const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./config');

const userSchema = mongoose.Schema({
    account: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: String
});

const user = module.exports = mongoose.model('user', userSchema);

user.getUserById = (id, callback) => {
    user.findById(id, callback);
}

user.getUserByAccount = (account, callback) => {
    const query = {
        account: account
    }
    user.findOne(query, callback);
}

user.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

user.comparePassword = (s, hash, callback) => {
    bcrypt.compare(s, hash)
    .then((res) => {
        callback(res);
    })
    .catch((err) => {
        throw err;
    });
}