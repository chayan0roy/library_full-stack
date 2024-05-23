const express = require('express');
const router = express.Router();
const { uploads, multiTypeUploads, imageGalleryUploads } = require('../middleware/multer');

const User_Schima = require('../models/user');
const Book_Schima = require('../models/book');
const ImageGallery_Schima = require('../models/imageGallery');
const Notice_Schima = require('../models/notice');





// Add Books
router.post('/addBook', multiTypeUploads, async (req, res) => {
    const { bookIMG, pdf1, pdf2 } = req.files;
    const { name, authorName, description, firstCatagory, secondCatagory } = req.body;
    try {
        const existingBook = await Book_Schima.findOne({ name: name });

        if (existingBook) {
            const existingAuthor = await Book_Schima.findOne({ authorName: authorName });
            if (existingAuthor) {
                existingBook.quantity = existingBook.quantity + 1;
                await existingBook.save();
                return res.status(200).json({ status: true, message: 'Book quantity updated successfully' });
            }
        }

        let bookIMGFileName = bookIMG[0].filename;
        let pdfs = {
            pdf1: pdf1[0].filename,
            pdf2: pdf2[0].filename
        }

        const newBook = new Book_Schima({ bookIMG: bookIMGFileName, name, authorName, quantity: 1, description, firstCatagory, secondCatagory, pdfs, bookLocation: true });
        await newBook.save();

        return res.status(200).json({ status: true, message: 'Book added successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});


// Update Books
router.post('/updateBook', multiTypeUploads, async (req, res) => {
    const updatesFile = req.files;
    const updatesTxt = req.body;
    try {
        const existingBook = await Book_Schima.findById(updatesTxt.bookId);
        if (!existingBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        await Book_Schima.findByIdAndUpdate(updatesTxt.bookId, updatesTxt);


        if (Object.keys(updatesFile).length !== 0) {
            if (updatesFile.bookIMG) {
                existingBook.bookIMG = updatesFile.bookIMG[0].filename;
            }
            if (updatesFile.pdf1) {
                existingBook.pdfs.pdf1 = updatesFile.pdf1[0].filename;
            }
            if (updatesFile.pdf2) {
                existingBook.pdfs.pdf2 = updatesFile.pdf2[0].filename;
            }
            await existingBook.save();
        }

        const updatedBook = await Book_Schima.findById(updatesTxt.bookId);
        console.log(updatedBook);

        return res.status(200).json({ status: true, message: 'Book updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});





















// Give Book
router.post('/giveBook', async (req, res) => {
    try {
        const { bookId, userId, bookAllowDate, renewDate } = req.body;

        const isBookExist = await Book_Schima.findById(bookId);
        const isUserExists = await User_Schima.findById(userId);

        if (!isBookExist || !isUserExists) {
            return res.status(404).json({ status: false, error: 'Book or user not found' });
        }



        if (isBookExist.quantity > 0) {
            isBookExist.quantity -= 1;
            if (isBookExist.quantity === 0) {
                isBookExist.bookLocation = false;
            }
        } else {
            isBookExist.bookLocation = false;
            return res.status(303).json({ status: false, error: 'Book Out of Stock' });
        }

        isBookExist.takingList.push({
            id: userId,
            email: isUserExists.email
        });

        isBookExist.orderedList = isBookExist.orderedList.filter(item => item.id !== userId);
        await isBookExist.save();

        isUserExists.bookTakingDetails.push({
            bookId: bookId,
            bookIMG: isBookExist.bookIMG,
            name: isBookExist.name,
            authorName: isBookExist.authorName,
            renewDetails: [{
                bookAllowDate: new Date(bookAllowDate),
                // renewDate: new Date(renewDate),
                reciveFine: 0,
                fine: 0
            }]
        });

        isUserExists.bookOrderedList = isUserExists.bookOrderedList.filter(item => item.bookId !== bookId);
        console.log(bookAllowDate);
        console.log(renewDate);
        await isUserExists.save();
        console.log("bookAllowDate");
        console.log("renewDate");
        return res.status(200).json({ status: true, message: 'Book successfully given' });
    } catch (err) {
        return res.status(700).json({ status: false, error: 'Internal Server Error' });
    }
});




































// Renew Book
router.post('/userRenueData', async (req, res) => {
    try {
        const { bookId, userId } = req.body;

        const isUserExist = await User_Schima.findById(userId);

        if (!isUserExist) {
            return res.status(404).json({ status: false, error: 'User not found' });
        }

        const isFound = isUserExist.bookTakingDetails.find(book => book.bookId === bookId);

        return res.status(200).json({ status: true, userRenueData: isFound.renewDetails });
    } catch (err) {
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});


// Renew Book
router.post('/renewBook', async (req, res) => {
    try {
        const { bookId, userId, bookAllowDate, renewDate, reciveFine } = req.body;

        const isBookExist = await Book_Schima.findById(bookId);
        const isUserExist = await User_Schima.findById(userId);

        if (!isBookExist || !isUserExist) {
            return res.status(404).json({ status: false, error: 'Book or user not found' });
        }

        const bookIndex = isUserExist.bookTakingDetails.findIndex(data => data.bookId === bookId);

        if (bookIndex !== -1) {
            isUserExist.bookTakingDetails[bookIndex].renewDetails.push({
                bookAllowDate: new Date(bookAllowDate),
                renewDate: new Date(renewDate),
                reciveFine: reciveFine,
                fine: 0
            });

        } else {

            return res.status(404).json({ status: false, error: 'Book not found in users taken books' });
        }
        await isUserExist.save();

        return res.status(200).json({ status: true, message: 'Book successfully renewed' });
    } catch (err) {
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});


// Recive Book
router.post('/reciveBook', async (req, res) => {
    try {
        const { bookId, userId, bookSubmitDate, reciveFine } = req.body;

        const isBookExist = await Book_Schima.findById(bookId);
        const isUserExist = await User_Schima.findById(userId);

        if (!isBookExist || !isUserExist) {
            return res.status(404).json({ status: false, error: 'Book or user not found' });
        }

        let renewDetails = {
            reciveFine: reciveFine
        }

        const bookIndex = isUserExist.bookTakingDetails.findIndex(data => data.bookId === bookId);
        if (bookIndex !== -1) {
            isUserExist.bookTakingDetails[bookIndex].renewDetails.push(renewDetails);
        } else {
            return res.status(404).json({ status: false, error: 'Book not found in users taken books' });
        }
        await isUserExist.save();

        const bookDetails = isUserExist.bookTakingDetails.find(item => item.bookId === bookId);
        if (!bookDetails) {
            return res.status(404).json({ status: false, error: 'Book not found in user details' });
        }

        isUserExist.bookSubmitDetails.push({
            bookId: bookDetails.bookId,
            bookIMG: bookDetails.bookIMG,
            name: bookDetails.name,
            authorName: bookDetails.authorName,
            bookSubmitDate: new Date(bookSubmitDate),
            renewDetails: bookDetails.renewDetails
        });

        isUserExist.bookTakingDetails = isUserExist.bookTakingDetails.filter(item => item.bookId !== bookId);
        await isUserExist.save();

        isBookExist.takingList = isBookExist.takingList.filter(item => item.id !== userId);
        isBookExist.bookLocation = true;
        isBookExist.quantity = isBookExist.quantity + 1;
        await isBookExist.save();

        return res.status(200).json({ status: true, message: 'Book successfully submitted' });
    } catch (err) {
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});


// Delete Books
router.delete('/deleteBook/:id', async (req, res) => {
    try {
        const bookId = req.params.id;

        const existingBook = await Book_Schima.findByIdAndDelete(bookId);
        if (!existingBook) {
            return res.status(404).json({ status: false, error: 'Book not found' });
        }

        return res.status(200).json({ status: true, message: 'Book deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// Add Catagory From Gallery
router.post('/addCategory', async (req, res) => {
    try {
        const { category } = req.body;

        const existingCategory = await ImageGallery_Schima.findOne({ category: category });
        if (existingCategory) {
            return res.status(400).json({ status: false, error: 'Category already exists' });
        }

        const newCategory = new ImageGallery_Schima({ category, imageList: [] });
        await newCategory.save();

        return res.status(200).json({ status: true, message: 'Category added successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// View Catagory From Gallery
router.get('/viewCategory', async (req, res) => {
    try {
        const allCategories = await ImageGallery_Schima.find();
        const categoryList = allCategories.map(category => category.category);

        res.json({ status: true, categoryList: categoryList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// Add Images From Gallery
router.post('/addImagesFromGallery', imageGalleryUploads, async (req, res) => {
    const { galleryImage } = req.files;
    const { selectCategory } = req.body;
    try {
        const existingCategory = await ImageGallery_Schima.findOne({ category: selectCategory });
        if (!existingCategory) {
            return res.status(400).json({ status: false, error: 'Category already exists' });
        }
        galleryImage.forEach(file => {
            existingCategory.imageList.push(file.filename);
        });
        await existingCategory.save();
        return res.status(200).json({ status: true, message: 'Image updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});


// Add Notice
router.post('/addNotice', async (req, res) => {
    try {
        const { title, description } = req.body;
        const date = new Date();
        const newNotice = new Notice_Schima({ title, description, date });

        await newNotice.save();

        return res.status(200).json({ status: true, message: 'Notice added successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// Delete Notice
router.delete('/deleteNotice/:id', async (req, res) => {
    try {
        const noticeId = req.params.id;

        const deletedNotice = await Notice_Schima.findByIdAndDelete(noticeId);

        if (!deletedNotice) {
            return res.status(404).json({ status: false, error: 'Notice not found' });
        }

        return res.status(200).json({ status: true, message: 'Notice deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// Update Notice
router.put('/updateNotice/:id', async (req, res) => {
    try {
        const noticeId = req.params.id;
        const { title, description, date } = req.body;

        const existingNotice = await Notice_Schima.findById(noticeId);
        if (!existingNotice) {
            return res.status(404).json({ status: false, error: 'Notice not found' });
        }

        existingNotice.title = title;
        existingNotice.description = description;
        existingNotice.date = date;

        await existingNotice.save();

        return res.status(200).json({ status: true, message: 'Notice updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});































// Delete Images From Gallery

// Delete Catagory From Gallery
router.delete('/deleteCategory/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;

        const deletedCategory = await ImageGallery_Schima.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return res.status(404).json({ status: false, error: 'Category not found' });
        }

        return res.status(200).json({ status: true, message: 'Category and associated images deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});


// Delete Users
router.delete('/deleteUser/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if the user exists
        const existingUser = await User_Schima.findByIdAndDelete(userId);

        // If the user doesn't exist
        if (!existingUser) {
            return res.status(404).json({ status: false, error: 'User not found' });
        }

        return res.status(200).json({ status: true, message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// Search Users
router.get('/searchUsers', async (req, res) => {
    try {
        const { query } = req.query;

        const foundUsers = await User_Schima.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        });

        res.json({ status: true, foundUsers: foundUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;
