const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { uploads } = require('../middleware/multer'); // Corrected import statement
const generateTokens = require('../utils/generateTokens.js');

const User_Schima = require('../models/user');
const Book_Schima = require('../models/book');
const ImageGallery_Schima = require('../models/imageGallery');
const Notice_Schima = require('../models/notice');
const sendOtpVerificationEmail = require('../utils/sendOtpVerificationEmail.js');
const sendPasswordVerificationEmail = require('../utils/sendPasswordVerificationEmail.js');
const EmailVerificationModel = require('../models/EmailVerification.js');






// checkAuth
router.post('/checkAuth', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.user) {
            res.status(200).json({ status: true, role: req.user.role });
        } else {
            return res.status(400).json({ status: false, error: 'User not found' });
        }
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(401).json({ status: false, error: 'Invalid or expired token' });
        }
        console.error(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// register
router.post('/register', uploads.single('image'), async (req, res) => {
    try {
        let profileIMG;
        if (req.file === undefined) {
            profileIMG = "accont.png";
        } else {
            profileIMG = req.file.filename;
        }

        const { name, mobileNumber, address, email, password } = req.body;

        if (!name || !mobileNumber || !address || !email || !password) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }

        const existingUser = await User_Schima.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ status: "failed", message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password, salt);


        let role;
        if (email === "chayanthe01guy@gmail.com") {
            role = "Admin"
        } else {
            role = "User"
        }

        const newUser = await new User_Schima({ profileIMG, name, mobileNumber, address, email, password: hashedPassword, role }).save();
        sendOtpVerificationEmail(req, res, newUser);

        res.status(201).json({
            status: true,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "failed", message: "Unable to Register, please try again later" });
    }
});

// User Email Verification
router.post('/verifyEmail', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }

        const existingUser = await User_Schima.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ status: "failed", message: "Email doesn't exists" });
        }

        if (existingUser.is_verified) {
            return res.status(400).json({ status: "failed", message: "Email is already verified" });
        }

        const emailVerification = await EmailVerificationModel.findOne({ userId: existingUser._id, otp });
        if (!emailVerification) {
            if (!existingUser.is_verified) {
                await sendEmail(req, res, existingUser)
                return res.status(400).json({ status: "failed", message: "Invalid OTP, new OTP sent to your email" });
            }
            return res.status(400).json({ status: "failed", message: "Invalid OTP" });
        }

        const currentTime = new Date();
        const expirationTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000);
        if (currentTime > expirationTime) {
            await sendEmail(req, res, existingUser)
            return res.status(400).json({ status: "failed", message: "OTP expired, new OTP sent to your email" });
        }

        existingUser.is_verified = true;
        await existingUser.save();

        const { auth_token } = await generateTokens(existingUser)

        await EmailVerificationModel.deleteMany({ userId: existingUser._id });
        res.status(200).json({
            status: true,
            role: existingUser.role,
            auth_token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: "Unable to verify email, please try again later" });
    }
})

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: "failed", message: "Email and password are required" });
        }

        const user = await User_Schima.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "failed", message: "Invalid Email or Password" });
        }

        if (!user.is_verified) {
            return res.status(401).json({ status: "failed", message: "Your account is not verified" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: "failed", message: "Invalid email or password" });
        }

        const { auth_token } = await generateTokens(user);

        res.status(200).json({
            status: true,
            role: user.role,
            auth_token
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: "Unable to login, please try again later" });
    }
});

// Get Profile
router.post('/getProfile', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        res.json({ status: true, existingUser: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/sendUserPasswordResetEmail', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ status: "failed", message: "Email field is required" });
        }
        const user = await User_Schima.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "failed", message: "Email doesn't exist" });
        }

        sendPasswordVerificationEmail(req, res, user);

        res.status(200).json({ status: true, message: "Password reset email sent. Please check your email." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: "Unable to send password reset email. Please try again later." });
    }
})


// // Password Reset
router.post('/userPasswordReset/:id/:token', async (req, res) => {
    try {
        const { newPassword, confromPassword } = req.body;
        const { id, token } = req.params;

        const user = await User_Schima.findById(id);
        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        const new_secret = user._id + process.env.JWT_TOKEN_SECRET_KEY;
        jwt.verify(token, new_secret);

        if (!newPassword || !confromPassword) {
            return res.status(400).json({ status: "failed", message: "New Password and Confirm New Password are required" });
        }

        if (newPassword !== confromPassword) {
            return res.status(400).json({ status: "failed", message: "New Password and Confirm New Password don't match" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User_Schima.findByIdAndUpdate(user._id, { $set: { password: hashedPassword } });

        res.status(200).json({ status: true, message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
            return res.status(400).json({ status: "failed", message: "Token expired. Please request a new password reset link." });
        }
        return res.status(500).json({ status: "failed", message: "Unable to reset password. Please try again later." });
    }
});







// User Email Verification
router.post('/verifyEmail', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }

        const existingUser = await User_Schima.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ status: "failed", message: "Email doesn't exists" });
        }

        if (existingUser.is_verified) {
            return res.status(400).json({ status: "failed", message: "Email is already verified" });
        }

        const emailVerification = await EmailVerificationModel.findOne({ userId: existingUser._id, otp });
        if (!emailVerification) {
            if (!existingUser.is_verified) {
                await sendEmail(req, res, existingUser)
                return res.status(400).json({ status: "failed", message: "Invalid OTP, new OTP sent to your email" });
            }
            return res.status(400).json({ status: "failed", message: "Invalid OTP" });
        }

        const currentTime = new Date();
        const expirationTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000);
        if (currentTime > expirationTime) {
            await sendEmail(req, res, existingUser)
            return res.status(400).json({ status: "failed", message: "OTP expired, new OTP sent to your email" });
        }

        existingUser.is_verified = true;
        await existingUser.save();

        const { auth_token } = await generateTokens(existingUser)

        await EmailVerificationModel.deleteMany({ userId: existingUser._id });
        res.status(200).json({
            status: true,
            role: existingUser.role,
            auth_token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: "Unable to verify email, please try again later" });
    }
})


// Update Profile Image
router.post('/updateProfileImage', passport.authenticate('jwt', { session: false }), uploads.single('image'), async (req, res) => {
    try {
        let profileIMG;
        if (req.file === undefined) {
            profileIMG = "accont.png";
        } else {
            profileIMG = req.file.filename;
        }

        const existingUser = req.user;

        existingUser.profileIMG = profileIMG;
        await existingUser.save();

        res.json({ status: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update Password
router.post('/updatePassword', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ status: "failed", message: "Current and new passwords are required" });
        }

        const existingUser = await User_Schima.findById(req.user._id);

        const isMatch = await bcrypt.compare(currentPassword, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ status: "failed", message: "Invalid email or password" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        existingUser.password = hashedPassword;
        await existingUser.save();

        res.json({ status: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// getBooks
router.get('/getBooks', async (req, res) => {
    try {
        const existingBook = await Book_Schima.find();

        res.json({ status: true, existingBook: existingBook });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Search Books
router.get('/searchBooks', async (req, res) => {
    try {
        const { query } = req.query;

        const foundBooks = await Book_Schima.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { authorName: { $regex: query, $options: 'i' } },
            ]
        });

        res.json({ status: true, foundBooks: foundBooks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// get Notice
router.get('/getNotice', async (req, res) => {
    try {
        const allNoticeList = await Notice_Schima.find();

        res.json({ status: true, allNoticeList: allNoticeList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// getImages
router.get('/getImages', async (req, res) => {
    try {
        const existingImage = await ImageGallery_Schima.find();

        res.json({ status: true, existingImage: existingImage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Order Books
router.post('/orderBook', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const existingUser = req.user;

        const { bookId } = req.body;
        const foundBooks = await Book_Schima.findById(bookId);

        if (!foundBooks) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const userOrderIds = existingUser.bookOrderedList.map(order => order.bookId);

        if (foundBooks.orderedList.length === 0) {
            foundBooks.orderedList.push({
                id: existingUser._id.toString(),
                email: existingUser.email
            });
            await foundBooks.save();

            existingUser.bookOrderedList.push(
                {
                    bookId: foundBooks._id.toString(),
                    bookImg: foundBooks.bookIMG,
                    bookName: foundBooks.name,
                    bookAuthorName: foundBooks.authorName,
                }
            );

            await existingUser.save();
            return res.status(200).json({ status: true, message: 'Success' });

        } else if (!userOrderIds.includes(foundBooks._id.toString())) {
            foundBooks.orderedList.push({
                id: existingUser._id.toString(),
                email: existingUser.email
            });
            await foundBooks.save();

            existingUser.bookOrderedList.push(
                {
                    bookId: foundBooks._id.toString(),
                    bookImg: foundBooks.bookIMG,
                    bookName: foundBooks.name,
                    bookAuthorName: foundBooks.authorName,
                }
            )
            await existingUser.save();
            return res.status(200).json({ status: true, message: 'Pending' });
        } else {
            return res.status(321).json({ message: 'You already ordered' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});







module.exports = router;