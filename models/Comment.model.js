const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const commentSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  },
);

const Comment = model('Comment', commentSchema);

module.exports = Comment;
