const express = require('express');
const { User, validate } = require('../models/User.model');
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

//reset password
router.post("/", async (req, res) => {
  try {
      const { error } = validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const user = await new User(req.body).save();

      res.send(user);
  } catch (error) {
      res.send("An error occured");
      console.log(error);
  }
});

module.exports = router;
