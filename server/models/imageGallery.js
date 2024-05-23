const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ImageGallery = new mongoose.Schema({
    category: {
        type: String
    },
    imageList: {
        type: Array,
    },
})


const ImageGallery_Schima = mongoose.model("imagegallerys", ImageGallery);
module.exports = ImageGallery_Schima;
