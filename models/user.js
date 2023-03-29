const mongoose = require('mongoose')


var userSchema = mongoose.Schema({
    username: String,
    password: String,
    fullname: String,
    phone: String,
    email: String,
    address: String,
    Birthdate: String,
    balance: Number,
    firstLogin: Boolean,
    status: String,
    role: String,
    wrongpw: Number,
    unusuallogin: Number,
    unusuallogintime: String,
    idcard: {
        photofrontName: String,
        photofrontPath: String,
        photobackName: String,
        photobackPath: String,
    },
    create_at: Date,
    update_at: Date
});

var User = mongoose.model('user', userSchema);
module.exports = User;