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
router.get('/settings/statistics', isAuthenticated, async (req, res) => {
  const loggedUser = req.payload;

  try {
    const allPosts = await Post.find();

    const getAverageViewsAndLikes = () => {
      const filteredPosts = allPosts.filter(
        (post) => post.owner.toString() !== loggedUser._id,
      );

      const myPosts = allPosts.filter(
        (post) => post.owner.toString() === loggedUser._id,
      );

      const totalViews = filteredPosts.reduce((previous, current) => {
        return previous + (current.views || 0);
      }, 0);

      const totalLikes = filteredPosts.reduce((previous, current) => {
        return previous + (current.likes || 0);
      }, 0);

      const userTotalViews = myPosts.reduce((previous, current) => {
        return previous + (current.views || 0);
      }, 0);

      const userTotalLikes = myPosts.reduce((previous, current) => {
        return previous + (current.likes || 0);
      }, 0);

      return {
        averageViews: Math.floor(totalViews / filteredPosts.length),
        averageLikes: Math.floor(totalLikes / filteredPosts.length),
        userTotalViews,
        userTotalLikes,
      };
    };

    const averageViewsAndLikes = getAverageViewsAndLikes();

    res.json(averageViewsAndLikes);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

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

// //reset password
// router.post("/", async (req, res) => {
//   try {
//       const { error } = validate(req.body);
//       if (error) return res.status(400).send(error.details[0].message);

//       const user = await new User(req.body).save();

//       res.send(user);
//   } catch (error) {
//       res.send("An error occured");
//       console.log(error);
//   }
// });

module.exports = router;
