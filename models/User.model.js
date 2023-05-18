const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required.'],
    },
    posts: {
      type: [Schema.Types.ObjectId],
      ref: 'Post',
    },
    likedPosts: {
      type: [Schema.Types.ObjectId],
      ref: 'Post',
    },
    image: {
      type: String,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  },
);

const User = model('User', userSchema);

module.exports = User;

// const { Schema, model } = require("mongoose");

// // TODO: Please make sure you edit the User model to whatever makes sense in this case
// const userSchema = new Schema(
//   {
//     email: {
//       type: String,
//       required: [true, "Email is required."],
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required."],
//     },
//     name: {
//       type: String,
//       required: [true, "Name is required."],
//     },
//   },
//   {
//     // this second object adds extra properties: `createdAt` and `updatedAt`
//     timestamps: true,
//   }
// );

// const User = model("User", userSchema);

// module.exports = User;
