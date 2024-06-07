// // const express = require('express');
// // const router = express.Router();
// // const Book = require('../models/Book');
// // const Story = require('../models/Story');

// // // Create a new book
// // router.get('/new', (req, res) => {
// //     res.render('new-book');
// // });

// // router.post('/new', async (req, res) => {
// //     const { title, description, tags } = req.body;
// //     const newBook = new Book({
// //         title,
// //         description,
// //         tags: tags.split(',').map(tag => tag.trim()),
// //         author: req.session.userId
// //     });
// //     await newBook.save();
// //     res.redirect('/');
// // });

// // // View book details and chapters
// // router.get('/:id', async (req, res) => {
// //     const book = await Book.findById(req.params.id).populate('author').populate('chapters');
// //     res.render('book-details', { book });
// // });

// // // Add a new chapter to a book
// // router.get('/:id/chapters/new', (req, res) => {
// //     res.render('new-chapter', { bookId: req.params.id });
// // });

// // router.post('/:id/chapters/new', async (req, res) => {
// //     const { title, content } = req.body;
// //     const newChapter = new Story({
// //         title,
// //         content,
// //         author: req.session.userId,
// //         book: req.params.id
// //     });

// //     await newChapter.save();
// //     await Book.findByIdAndUpdate(req.params.id, { $push: { chapters: newChapter._id } });
// //     res.redirect(`/books/${req.params.id}`);
// // });

// // module.exports = router;
// const express = require('express');
// const router = express.Router();
// const Book = require('../models/Book');
// const Story = require('../models/Story');

// // Create a new book
// router.get('/new', (req, res) => {
//     res.render('new-book');
// });

// router.post('/new', async (req, res) => {
//     const { title, description, tags } = req.body;
//     const newBook = new Book({
//         title,
//         description,
//         tags: tags.split(',').map(tag => tag.trim()),
//         author: req.session.userId
//     });
//     await newBook.save();
//     res.redirect('/');
// });

// // View book details and chapters
// router.get('/:id', async (req, res) => {
//     const book = await Book.findById(req.params.id).populate('author').populate('chapters');
//     res.render('book-details', { book });
// });

// // Add a new chapter to a book
// router.get('/:id/chapters/new', (req, res) => {
//     res.render('new-chapter', { bookId: req.params.id });
// });

// router.post('/:id/chapters/new', async (req, res) => {
//     const { title, content } = req.body;
//     const newChapter = new Story({
//         title,
//         content,
//         author: req.session.userId,
//         book: req.params.id
//     });

//     await newChapter.save();
//     await Book.findByIdAndUpdate(req.params.id, { $push: { chapters: newChapter._id } });
//     res.redirect(`/books/${req.params.id}`);
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const multer = require('multer');
const Book = require('../models/Book');
const Story = require('../models/Story');

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        res.redirect('/users/login');
    }
}

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/thumbnails');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Create a new book form
router.get('/new', isAuthenticated, (req, res) => {
    res.render('new-book');
});

// Handle new book creation
router.post('/new', isAuthenticated, upload.single('thumbnail'), async (req, res) => {
    const { title, description, tags } = req.body;
    const thumbnail = req.file ? req.file.filename : null;

    const newBook = new Book({
        title,
        description,
        tags: tags.split(',').map(tag => tag.trim()),
        author: req.session.userId, // Ensure this is set
        thumbnail: thumbnail
    });

    await newBook.save();
    res.redirect('/');
});

// View book details and chapters
router.get('/:id', async (req, res) => {
    const book = await Book.findById(req.params.id).populate('author').populate('chapters');
    res.render('book-details', { book });
});

// Add a new chapter to a book
router.get('/:id/chapters/new', isAuthenticated, (req, res) => {
    res.render('new-chapter', { bookId: req.params.id });
});

router.post('/:id/chapters/new', isAuthenticated, async (req, res) => {
    const { title, content } = req.body;
    const newChapter = new Story({
        title,
        content,
        author: req.session.userId,
        book: req.params.id
    });

    await newChapter.save();
    await Book.findByIdAndUpdate(req.params.id, { $push: { chapters: newChapter._id } });
    res.redirect(`/books/${req.params.id}`);
});

module.exports = router;
