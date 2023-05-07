const express = require('express');
const User = require('../models/User.model');
const Post = require('../models/Post.model');
const Comment = require('../models/Comment.model');
const { isAuthenticated } = require('../middleware/jwt.middleware.js');

const router = express.Router();

router.post('/', isAuthenticated, async (req, res) => {
  const { text, postId } = req.body;
  const user = req.payload; //payload is the autenthicated user

  if (!text) {
    res.sendStatus(400).json({ message: 'Provide a comment' });
    return;
  }
  if (!user) {
    res
      .sendStatus(400)
      .json({ message: 'You must be logged in to create a comment.' });
    return;
  }

  try {
    const newComment = await Comment.create({
      owner: user._id,
      text,
      post: postId,
    });

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    await newComment.populate('owner');

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Could not create comment', error);
    res.status(500).send('Could not create comment');
  }
});

//delete a comment
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Post.findByIdAndDelete(id);

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
