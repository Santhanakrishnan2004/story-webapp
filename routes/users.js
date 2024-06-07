const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Story = require('../models/Story');
const Book = require('../models/Book');


// // User registration
// router.get('/register', (req, res) => {
//     res.render('register');
// });

// router.post('/register', async (req, res) => {
//     const { username, email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({ username, email, password: hashedPassword });
//     await newUser.save();

//     res.redirect('/users/login');
// });

// // User login
// router.get('/login', (req, res) => {
//     res.render('login');
// });

// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });

//         if (user && await bcrypt.compare(password, user.password)) {
//             req.session.user = user; // Set user object in session
//             res.redirect('/');
//         } else {
//             // Invalid credentials
//             res.status(401).redirect('/users/login');
//         }
//     } catch (error) {
//         // Handle errors
//         console.error('Error in login:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// // router.post('/login', async (req, res) => {
// //     try {
// //         const { email, password } = req.body;
// //         const user = await User.findOne({ email });

// //         if (user && await bcrypt.compare(password, user.password)) {
// //             req.session.userId = user._id;
// //             console.log("hiiiiiiiiii");
// //             res.redirect('/');
// //         } else {
// //             // Invalid credentials
// //             console.log('Error in login:');
// //             res.status(401).redirect('/users/login');
// //         }
// //     } catch (error) {
// //         // Handle errors
// //         console.error('Error in login:', error);
// //         res.status(500).send('Internal Server Error');
// //     }
// // });


// // User logout
// router.get('/logout', (req, res) => {
//     req.session.destroy();
//     res.redirect('/');
// });

// User profile
router.get('/profile', async (req, res) => {
    const user = await User.findById(req.session.userId);
  
    res.render('profile', { user });
  
});

// Story creation
router.get('/story/new', (req, res) => {
    res.render('new-story');
});

router.post('/story/new', async (req, res) => {
    const { title, content } = req.body;
    const newStory = new Story({
        title,
        content,
        author: req.session.userId
    });

    await newStory.save();
    res.redirect('/');
});

module.exports = router;


// User registration
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.redirect('/users/login');
});
// User login
router.get('/login', (req, res) => {
    res.render('login');
});


router.get('/mystories', async (req, res) => {
    try {
        // Get the stories created by the current user
        const userStories = await Book.find({ author: req.session.userId });
           console.log(userStories);
        // Render the my-stories template with user's stories
        res.render('my-stories', { stories: userStories });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});




// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });

//     if (user && user.password === password) {
//         req.session.userId = user._id; // Set the userId in the session
//         req.session.user = user; // Also store the user object in the session
//         res.redirect('/');
//     } else {
//         res.redirect('/users/login');
//     }
// });
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id; // Set the userId in the session
            req.session.user = user; // Also store the user object in the session
            console.log("hiiiiiiiiii");
            res.redirect('/');
        } else {
            // Invalid credentials
            console.log('Error in login:');
            res.status(401).redirect('/users/login');
        }
    } catch (error) {
        // Handle errors
        console.error('Error in login:', error);
        res.status(500).send('Internal Server Error');
    }
});
// User logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
