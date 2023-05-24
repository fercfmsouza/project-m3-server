# *Pets Social Media* · project-m3-server

## Description
**Pets** it's the *first* Social Media for your pet!
- Share your pet's best pictures :cat:
  - and see how popular they get. :parrot:
- You can check your friend's pet profile, :dog:
  - like them posts 🐑
  - and share your thoughts in the comments. 🐠

## Backend - server
### Models

- *User Model*
  ```
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
    }
  ```
- *Post model*
  ```
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    description: {
      type: String,
      required: true,
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: 'Comment',
    },
    image: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
    },
    likes: {
      type: Number,
    }
  ```
- *Comment model*
  ```
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
    }
  ```
### Cloudinary API
We used Cloudinary to upload the images.
```
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ['jpg', 'png'],
    folder: 'images', // The name of the folder in cloudinary
    // resource_type: 'raw' => this is in case you want to upload other type of files, not just images
  },
});

const imageUploader = multer({ storage }).single('image');

module.exports = { imageUploader };
```

### Routes

- *Post routing*
  - POST '/' - create a new post
  - GET '/' - all the posts
  - GET '/:id' - one specific post
  - PUT '/:id' - edit an specific post
  - PUT '/:id/views/increment' - increase the views
  - PUT '/:id/likes' - increase or decrease the likes
  - DELETE '/:id' - delete the post

- *User routing*
  - GET '/:id' - specific user profile
  - GET '/settings/statistics' - display statistics

- *Auth routes*
  - POST '/signup' - create new user 
  - POST '/login' - log in with email and password
  - GET '/verify' - check if token is valid and sends user data
  
- *Comments routing*
  - POST '/' - post new comment
  - DELETE '/:id/posts/:postId' - delete a specific comment from an specific post

### Deployment issues
```
app.use(
    cors({
      origin: '*',
    }),
  );
```

## Backlog

- Sign in / Log in from Google
- Reset the password
- Edit User info (email and profile image)
