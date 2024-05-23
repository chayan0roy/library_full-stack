const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Book = new mongoose.Schema({
    bookIMG: {
        type: String
    },
    name: {
        type: String,
    },
    authorName: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    description: {
        type: String,
    },
    firstCatagory: {
        type: String
    },
    secondCatagory: {
        type: String
    },
    pdfs: {
        pdf1: {
            type: String,
        },
        pdf2: {
            type: String,
        }
    },
    takingList: {
        type: Array
    },
    orderedList: {
        type: Array
    },
    bookLocation: {
        type: Boolean
    }
})

const Book_Schima = mongoose.model("books", Book);
module.exports = Book_Schima;
