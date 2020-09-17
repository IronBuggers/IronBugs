const express = require("express");
const User = require("../models/User");
const Bug = require("../models/Bug");
const router = express.Router();
const { uploader, cloudinary } = require("../config/cloudinary.js");

/* GET home page */

// router.get("/bugArea", (req, res, next) => {
// 	console.log(req.user);
// 	res.render("bugArea", { currentUser: req.user });
// });

router.post("/bugArea/form/:userId", uploader.single("image"), (req, res, next) => {
	const userId = req.params.userId;
	const { name, bootcamp, type, location } = req.body;

	const imgName = req.file.originalname;
	const imgPath = req.file.url;
	const imgPublicId = req.file.public_id;

	console.log(name);
	console.log(bootcamp);
	console.log(type);
	console.log(location);

	User.findByIdAndUpdate(userId, {
		name,
		bootcamp,
		timeType: type,
		location,
		imgName,
		imgPath,
		imgPublicId,
		firstSignin: false,
	})
		.then((found) => res.redirect("bugArea"))
		.catch((error) => console.log(error));

	console.log(userId);
	res.redirect("/bugArea");
});

router.get("/firstSignin", (req, res, next) => {
	res.render("firstSignin");
});

router.get("/userProfile", async (req, res, next) => {
	let bugMap = {};
	let userBugs = await Bug.find({ userId: req.user._id }, function (error, bugs) {
		bugs.forEach(function (bug) {
			bugMap[bug._id] = bug;
		});
		return bugMap;
	});
	console.log(userBugs);
	// 	userId: req.user._id
	// })
	console.log(bugMap);
	res.render("userProfile", { currentUser: req.user, bugMap });
});

router.get("/profile/:user-name");

module.exports = router;
