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

    await User.findByIdAndUpdate(newPost.owner._id, {
      $push: { posts: newPost._id },
    });

    await newPost.populate('owner');

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Could not create post');
    res.status(500).send('Could not create post');
  }
});

// all the posts
// Find User by ID if ID is the same as post.owner._id
// then push the post to user.posts array
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('comments');

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate({
      path: 'comments',
      populate: {
        path: 'owner',
        model: 'User',
      },
    });

    await post.populate('owner');

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

//delete a post
router.delete('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const user = req.payload;

  try {
    await Post.findByIdAndDelete(id);

    await User.findByIdAndUpdate(user._id, {
      $pull: { posts: id },
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

//edit post
router.put('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const editPost = await Post.findByIdAndUpdate(id);

    res.json(editPost);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
