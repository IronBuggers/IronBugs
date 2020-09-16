const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bugSchema = new Schema({
  title: String,
  description: String,
  imgName: {
    type: String,
    default: "",
  },
  imgPath: {
    type: String,
    default: "",
  },
  imgPublicId: {
    type: String,
    default: "",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  anonym: {
    type: Boolean,
    default: false,
  },
  
  bugnumber: Number,
  
  status: {
    type: String,
    default: 'Active',
  },
  votes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }]

},
{
  timestamps: true
});



const Bug = mongoose.model('Bug', bugSchema);

module.exports = Bug;
