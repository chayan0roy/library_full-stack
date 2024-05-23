const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = new mongoose.Schema({
    profileIMG: {
        type: String
    },
    name: {
        type: String,
    },
    mobileNumber: {
        type: Number,
    },
    address: {
        type: String,
    },
    role: {
        type: String,
    },
    email: {
        type: String
    },
    password: {
        type: String,
    },
    is_verified: {
        type: Boolean
    },
    bookTakingDetails: [
        {
            bookId: {
                type: String
            },
            bookIMG: {
                type: String
            },
            name: {
                type: String,
            },
            authorName: {
                type: String,
            },
            renewDetails: [{
                bookAllowDate: {
                    type: Date,
                },
                renewDate: {
                    type: Date,
                },
                reciveFine: {
                    type: Number,
                },
                fine: {
                    type: Number,
                }
            }],
        }
    ],
    bookSubmitDetails: [
        {
            bookId: {
                type: String
            },
            bookIMG: {
                type: String
            },
            name: {
                type: String,
            },
            authorName: {
                type: String,
            },
            bookSubmitDate: {
                type: String,
            },
            renewDetails: [{
                bookAllowDate: {
                    type: Date,
                },
                renewDate: {
                    type: Date,
                },
                fine: {
                    type: Number,
                }
            }],
        }
    ],
    bookOrderedList: {
        type: Array,
    },
    watchList: {
        type: Array,
    }
})

const User_Schima = mongoose.model("users", User);
module.exports = User_Schima;




