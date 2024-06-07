const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/User');
const Book = require('./models/Book');
const app = express();
const path = require('path');
const port = process.env.PORT || 5000;
const multer = require('multer');
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
// Session setup
app.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://santhanakrishnan9704:wNg83QkDMk4mXFS8@story1.jp2worw.mongodb.net/',
        collectionName: 'sessions'
    })
}));

// MongoDB connection
mongoose.connect('mongodb+srv://santhanakrishnan9704:wNg83QkDMk4mXFS8@story1.jp2worw.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

app.use(async (req, res, next) => {
    if (req.session.userId) {
        res.locals.user = await User.findById(req.session.userId);
    } else {
        res.locals.user = null;
    }
    next();
});
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/thumbnails');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

app.get('/search', async (req, res) => {
    const perPage = 15; // Number of books per page
    const page = req.query.page || 1; // Current page number
    const query = req.query.query || '';
    const searchBy = req.query.searchBy ? req.query.searchBy.split(',') : [];

    let searchCriteria = {};

    if (query) {
        if (searchBy.includes('tags')) {
            searchCriteria.tags = { $regex: query, $options: 'i' };
        }
        if (searchBy.includes('author')) {
            const user = await User.findOne({ username: { $regex: query, $options: 'i' } });
            if (user) {
                searchCriteria.author = user._id;
            }
        }
        if (searchBy.includes('title')) {
            searchCriteria.title = { $regex: query, $options: 'i' };
        }
        // Default search (if no checkboxes are selected)
        if (searchBy.length === 0) {
            searchCriteria.title={ $regex: query, $options: 'i' };
        }
    }

    const totalCount = await Book.countDocuments(searchCriteria); // Total number of books
    const totalPages = Math.ceil(totalCount / perPage); // Calculate total pages

    const books = await Book.find(searchCriteria)
        .populate('author')
        .limit(perPage)
        .skip((page - 1) * perPage);

    const user = req.session.user;

    res.render('searchresult', { books, pages: totalPages, currentPage: page, user, query, searchBy });
});

// app.get('/', async (req, res) => {
//     const perPage = 15; // Number of books per page
//     const page = req.query.page || 1; // Current page number
//     const totalCount = await Book.countDocuments(); // Total number of books
//     const totalPages = Math.ceil(totalCount / perPage); // Calculate total pages

//     const books = await Book.find()
//         .limit(perPage)
//         .skip((page - 1) * perPage);

//         const user = req.session.user;
//         console.log(user);

//     res.render('index', { books, pages: totalPages, currentPage: page ,user});
// });
app.get('/', async (req, res) => {
    const perPage = 15; // Number of books per page
    const page = req.query.page || 1; // Current page number
    const totalCount = await Book.countDocuments(); // Total number of books
    const totalPages = Math.ceil(totalCount / perPage); // Calculate total pages

    const books = await Book.find()
        .populate('author') // Populate the author field
        .limit(perPage)
        .skip((page - 1) * perPage);
    // console.log(books);

    const user = req.session.user;

    res.render('index', { books, pages: totalPages, currentPage: page, user });
});



// Routes
// app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/books', require('./routes/books'));
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
