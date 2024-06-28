const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const database = require('./config/database');
require('./config/passport-jwt-strategy');

const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));


app.get('/', async (req, res) => {
    res.status(200).json({ message: 'Hii Dada, your server is running' });
});


app.use('/Admin', adminRoutes);
app.use('/User', userRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
