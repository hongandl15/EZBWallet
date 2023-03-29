const mongoose = require('mongoose')

var transactionSchema = mongoose.Schema({
    username: String,
    receiver: String,
    id: String,
    type: String,
    note: String,
    date: String,
    status: String,
    verified: Boolean,
    value: String,
    card: Array,
    creditcard: String,
    cvv: String
});

var Transaction = mongoose.model('transaction', transactionSchema);
module.exports = Transaction;