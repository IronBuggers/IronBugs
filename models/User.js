const mongoose = require("mongoose")
const Schema = mongoose.Schema
const userSchema = new Schema({

  email: String,
  password: String,
  firstSignin: {
    type: Boolean,
    default: true
  },
  githubId: String,
  googleId: String,
  avatar: String,
  name: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  votes: [
    {type: Schema.Types.ObjectId, ref: 'Bug'} 
  ],
  bootcamp: String,

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

	bootcamp: String,
	timeType: String,
	location: String,
	firstSignin: {
		type: Boolean,
		default: true,
	},
	githubId: String,
	googleId: String,
	avatar: String,
	name: String,
	role: {
		type: String,
		enum: ["user", "admin"],
		default: "user",
	},
})

const User = mongoose.model("User", userSchema)
module.exports = User
