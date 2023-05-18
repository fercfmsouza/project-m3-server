const express = require('express');
const User = require('../models/User.model');
const Post = require('../models/Post.model');
const { isAuthenticated } = require('../middleware/jwt.middleware.js');
const { imageUploader } = require('../config/cloudinary.config');

const router = express.Router();

//create a post
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

// get all the posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('comments');

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// get one post
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

// increase views
router.put('/:id/views/increment', async (req, res) => {
  const { id } = req.params;

  try {
    await Post.findByIdAndUpdate(id, {
      $inc: { views: 1 },
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// working likes
 router.put('/:id/likes', async (req, res) => {
   const { id } = req.params;
   const likes = req.body;

   try {
     await Post.findByIdAndUpdate(id, likes);

     res.sendStatus(200);
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

  console.log('body', req.body);

  try {
    await Post.findByIdAndUpdate(id, req.body);

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
