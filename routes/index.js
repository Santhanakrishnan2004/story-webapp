const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const Book = require('../models/Book');

// Home page


router.get('/', async (req, res) => {
    const perPage = 15; // Number of books per page
    const page = req.query.page || 1; // Current page number
    const totalCount = await Book.countDocuments(); // Total number of books
    const totalPages = Math.ceil(totalCount / perPage); // Calculate total pages

    const books = await Book.find()
        .limit(perPage)
        .skip((page - 1) * perPage);

        const user = req.session.user;

    res.render('index', { books, pages: totalPages, currentPage: page ,user});
});



module.exports = router;
