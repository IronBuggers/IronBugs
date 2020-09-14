const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bugSchema = new Schema({
  title: String,
  description: String,
  image: String,
  anonymous: {
    type: String,
    enum: ['anonymous', 'public'],
    default: 'public'
  }

});

const Bug = mongoose.model('Bug', bugSchema);
module.exports = Bug;
