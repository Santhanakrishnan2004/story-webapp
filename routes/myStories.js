    // routes/myStories.js

    const express = require('express');
    const router = express.Router();
    const Story = require('../models/Story'); // Import your Story model here

    // GET route for "My Stories"
    // router.get('/my-stories', async (req, res) => {
    //     try {
    //         // Get the stories created by the current user
    //         const userStories = await Story.find({ author: req.session.userId });

    //         // Render the my-stories template with user's stories
    //         res.render('my-stories', { stories: userStories });
    //     } catch (err) {
    //         console.error(err);
    //         res.status(500).send('Internal Server Error');
    //     }
    // });
// GET route for "My Stories"
router.get('/', async (req, res) => {
    try {
        // Get the stories created by the current user
        const userStories = await Story.find({ author: req.session.userId });
           console.log(userStories);
        // Render the my-stories template with user's stories
        res.render('my-stories', { stories: userStories });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

    module.exports = router;
