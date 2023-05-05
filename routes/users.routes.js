const express = require('express');
const User = require('../models/User.model');
const Post = require('../models/Post.model');
const { isAuthenticated } = require('../middleware/jwt.middleware.js');
const { imageUploader } = require('../config/cloudinary.config');

const router = express.Router();

router.get('/:id', async (req, res) => {
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

module.exports = router;
