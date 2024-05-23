const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Notice = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
    },
})

const Notice_Schima = mongoose.model("notices", Notice);
module.exports = Notice_Schima;
