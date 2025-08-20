const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    date : {
        type: Date
        // required: true
    },
    title: {
        type: String
        // required: true
    },
    amount: {
        type: Number
        // required: true
    },
    type: {
        type: String
        // rquired: true
    }
});

const Expense = mongoose.model('Expense', schema);
module.exports = Expense;