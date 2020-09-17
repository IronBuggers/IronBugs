const express = require("express");
const router = express.Router();
const Bug = require("../models/Bug");
const middleware = require("./middlewares");
const { uploader, cloudinary } = require("../config/cloudinary.js");
const User = require("../models/User");
let voteNumber = 0;

router.get("/addBug", (req, res, next) => {
	res.render("addBug");
});

router.post("/filterByLocation", (req, res) => {
	let locationOfTheBootcamp = req.body.chooseBootcamp;
	let array = [];

	Bug.find({ status: "Active", location: locationOfTheBootcamp })
		.then((bugsFromDB) => {
			// const bugs = bugsFromDB.map(bugFromDB => {
			//   return {title: bugFromDB.title, description: bugFromDB.description, imgPath: bugFromDB.imgPath, _id: bugFromDB._id, numberOfVotes: bugFromDB.votes.length}
			// })
			const bugs = bugsFromDB.map((bugFromDB) => {
				let hasVoted = req.user.votes.includes(bugFromDB._id);
				return {
					title: bugFromDB.title,
					description: bugFromDB.description,
					imgPath: bugFromDB.imgPath,
					_id: bugFromDB._id,
					numberOfVotes: bugFromDB.votes.length,
					hasVoted: hasVoted,
				};
			});

			// console.log({array});
			// console.log('This is bugs',bugsFromDB);
			// console.log(req.session.user);
			res.render("bugArea", { bugsList: bugs, currentUser: req.user, lengthVotes: array });
		})

		.catch((error) => {
			console.log(error);
		});
});

router.post("/bugs", uploader.single("bugImg"), async (req, res) => {
	let imgName;
	let imgPath;
	let imgPublicId;
	if (req.file !== undefined) {
		imgName = req.file.originalname;
		imgPath = req.file.url;
		imgPublicId = req.file.public_id;
	} else {
		imgName = "Default Image";
		imgPath = "";
		imgPublicId = "";
	}

	let anonym = req.body.anonym;
	// console.log(req.body.anonym);
	if (anonym === "on") {
		anonym = true;
	} else {
		anonym = false;
	}
	// console.log('I am in');
	// let bugCounter = Bug.count({}, function(error, numOfDocs) {
	//   if (error) console.log("Count is not working");
	//   console.log(numOfDocs);
	// })
	let bugCounter = await Bug.find();
	const { title, description, image } = req.body;
	Bug.create({
		location: req.user.location,
		title,
		description,
		imgName,
		imgPath,
		imgPublicId,
		anonym,
		userId: req.user._id,
		bugnumber: bugCounter.length + 1,
	})
		.then((bug) => {
			res.redirect(`/bugs/${bug._id}`);
		})
		.catch((error) => {
			console.log(error);
		});
});

router.get("/bugArea", middleware.loginCheck(), (req, res, next) => {
	let array = [];

	Bug.find({ status: "Active" })
		.then((bugsFromDB) => {
			// const bugs = bugsFromDB.map(bugFromDB => {
			//   return {title: bugFromDB.title, description: bugFromDB.description, imgPath: bugFromDB.imgPath, _id: bugFromDB._id, numberOfVotes: bugFromDB.votes.length}
			// })
			const bugs = bugsFromDB.map((bugFromDB) => {
				let hasVoted = req.user.votes.includes(bugFromDB._id);
				return {
					title: bugFromDB.title,
					description: bugFromDB.description,
					imgPath: bugFromDB.imgPath,
					_id: bugFromDB._id,
					numberOfVotes: bugFromDB.votes.length,
					hasVoted: hasVoted,
				};
			});

			// console.log({array});
			// console.log('This is bugs',bugsFromDB);
			// console.log(req.session.user);
			res.render("bugArea", { bugsList: bugs, currentUser: req.user, lengthVotes: array });
		})

		.catch((error) => {
			console.log(error);
		});
});

router.get("/bugArea", middleware.loginCheck(), (req, res, next) => {
	Bug.find().then((bugsFromDB) => {
		res.render("bugArea", { bugsList: bugsFromDB, currentUser: req.user });
	});
});

router.get("/bugs/:id", (req, res) => {
	const id = req.params.id;
	Bug.findById(id)
		.then((bugFromDB) => {
			let isUserBug = "" + bugFromDB.userId == "" + req.user._id;
			User.findById(bugFromDB.userId).then((bugOwner) => {
				res.render("bugDetails", {
					bug: bugFromDB,
					currentUser: req.user,
					isUserBug: isUserBug,
					bugOwner: bugOwner,
				});
			});
		})
		.catch((error) => {
			console.log(error);
		});
});

router.get("/postVotes/:id", (req, res) => {
	const id = req.params.id;
	// if (voteNumber < 1) {
	Bug.findByIdAndUpdate(id, { $push: { votes: req.user._id } })
		.then((bugFromDB) => {
			User.findByIdAndUpdate(req.user._id, { $push: { votes: bugFromDB._id } }).then((user) => {
				res.redirect("/bugArea");
			});
		})
		.catch((error) => {
			console.log(error);
		});
	// } else {
	//   res.redirect('/bugArea')
	// } voteNumber = 1
});

router.get("/bugs/:id", (req, res) => {
	const id = req.params.id;
	Bug.findById(id)
		.then((bugFromDB) => {
			res.render("bugDetails", { bug: bugFromDB, currentUser: req.user });
		})
		.catch((error) => {
			console.log(error);
		});
});

router.get("/bugs/edit/:id", (req, res) => {
	const id = req.params.id;
	Bug.findById(id)
		.then((bugFromDB) => {
			// render an edit form with the data from the book
			res.render("bugEditForm", { bug: bugFromDB });
		})
		.catch((error) => {
			console.log(error);
		});
});

router.post("/bugs/edit/:id", uploader.single("bugEditImg"), (req, res) => {
	let imgName;
	let imgPath;
	let imgPublicId;
	if (req.file !== undefined) {
		imgName = req.file.originalname;
		imgPath = req.file.url;
		imgPublicId = req.file.public_id;
	} else {
		imgName = "Default Image";
		imgPath = "";
		imgPublicId = "";
	}
	let status = req.body.bugStatus;
	const { description } = req.body;
	const id = req.params.id;

	Bug.findByIdAndUpdate(id, {
		description,
		imgName,
		imgPath,
		imgPublicId,
		status,
	})
		.then((bug) => {
			res.redirect(`/bugs/${bug._id}`);
		})
		.catch((error) => {
			console.log(error);
		});
});

router.get("/bugArea/solved", (req, res) => {
	Bug.find({ status: "Solved" }).then((solvedBugs) => {
		res.render("solvedBugs", { solvedBugs });
	});
});

module.exports = router;
