const express = require('express');
const router = express.Router();

const User = require('../models/User.model');
const { isAuthenticated } = require('../middleware/jwt.middleware.js');

const Post = require('../models/Post.model')

router.post('/create', (req, res) => {
  // const body = req.body;
  const { description, image } = req.body

  if (description === '' || image === '' ) {
    res.sendStatus(400).json({ message: 'Provide a description and image' });
    return;
  }

  console.log(info);

  res.sendStatus(201);
});

module.exports = router;
