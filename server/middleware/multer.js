const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const uploads = multer({ storage: storage });
const multiTypeUploads = uploads.fields([
    { name: 'bookIMG', maxCount: 1 },
    { name: 'pdf1', maxCount: 1 },
    { name: 'pdf2', maxCount: 1 }
]);
const imageGalleryUploads = uploads.fields([
    { name: 'galleryImage', maxCount: 50 }
]);

module.exports = { uploads, multiTypeUploads, imageGalleryUploads };
