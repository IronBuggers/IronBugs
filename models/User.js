const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: String,
  password: String,
  firstSignin: {
    type: Boolean,
    default: true
  },
  githubId: String,
  avatar: String,
  name: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

});

const User = mongoose.model('User', userSchema);
module.exports = User;
