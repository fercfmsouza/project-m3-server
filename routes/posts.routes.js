const express = require('express');
const User = require('../models/User.model');
const Post = require('../models/Post.model');
const { isAuthenticated } = require('../middleware/jwt.middleware.js');
const { imageUploader } = require('../config/cloudinary.config');

const router = express.Router();

router.post('/', isAuthenticated, imageUploader, async (req, res) => {
  const { description } = req.body;
  const user = req.payload;

  if (!description || !req.file?.path) {
    res.sendStatus(400).json({ message: 'Provide a description and image' });
    return;
  }

  try {
    const newPost = await Post.create({
      owner: user._id,
      description,
      image: req.file.path,
    });

    await newPost.populate('owner');

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Could not create post');
    res.status(500).send('Could not create post');
  }
});

// all the posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
