const express = require('express');
const User = require('../models/User.model');
const Post = require('../models/Post.model');
const { isAuthenticated } = require('../middleware/jwt.middleware.js');
const { imageUploader } = require('../config/cloudinary.config');

const router = express.Router();

router.get('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const user = req.payload;

  try {
    const user = await User.findById(id);
    await user.populate('posts');

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

//settings
router.post('/settings', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const user = req.payload;

  try {
    const user = await User.findById(id);
    await user.populate('posts');

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// edit user.email
router.put('/:id', isAuthenticated, async (req, res) => {
  const user = req.payload;

  console.log('body', req.body);
  console.log('user', req.payload);

  try {
     await User.findByIdAndUpdate(user._id, req.body);

     res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
