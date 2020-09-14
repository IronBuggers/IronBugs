const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bugSchema = new Schema({
  title: String,
  description: String,
  image: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }

});

const Bug = mongoose.model('Bug', bugSchema);

module.exports = Bug;
