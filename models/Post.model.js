const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const postSchema = new Schema(
  {
    owner: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
    description: {
      type: String,
      required: true,
    },
    comments: [
      {
        type: [Schema.Types.ObjectId],
        ref: 'Comment',
      },
    ],
    image: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
    },
    likes: {
      type: Number,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  },
);

const Post = model('Post', postSchema);

module.exports = Post;
