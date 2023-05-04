const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../../models/User.model');

const MONGO_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/project-m3';

(async () => {
  try {
    const mongoConnection = await mongoose.connect(MONGO_URI);

    const dbName = mongoConnection.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${dbName}"`);

    // default password = test123
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync('test123', salt);

    const user1 = {
      email: 'testuser1@test.com',
      password: hashedPassword,
      username: 'testuser1',
    };

    const user2 = {
      email: 'testuser2@test.com',
      password: hashedPassword,
      username: 'testuser2',
    };

    const promiseArray = [user1, user2].map((user) => User.create(user));

    try {
      await Promise.all(promiseArray);

      console.log('Users created!');

      mongoConnection.disconnect();
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error('Error connecting to mongo: ', error);
  }
})();
