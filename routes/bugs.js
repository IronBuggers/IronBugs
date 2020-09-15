
const express = require('express');
const router  = express.Router();
const Bug = require('../models/Bug');
const middleware = require('./middlewares');
const { uploader, cloudinary } = require("../config/cloudinary.js");
const User = require('../models/User')

router.get("/addBug", (req, res, next) => {
	res.render("addBug");
});

router.post("/bugs", (req, res) => {
	console.log("I am in");
	const { title, description, image } = req.body;
	Bug.create({
		title: title,
		description: description,
		image: image,
	})
		.then((bug) => {
			console.log(`new Bug is here: ${bug}`);
			res.redirect(`/bugs/${bug._id}`);
		})
		.catch((error) => {
			console.log(error);
		});
});

router.get("/bugArea", middleware.loginCheck(), (req, res, next) => {
	Bug.find()
		.then((bugsFromDB) => {
			console.log("This is bugs", bugsFromDB);
			console.log(req.session.user);
			res.render("bugArea", { bugsList: bugsFromDB, currentUser: req.user });
		})


router.get('/bugs/:id', (req, res) => {
    const id = req.params.id
    Bug.findById(id).then(bugFromDB => {
      let isUserBug = '' + bugFromDB.userId == '' + req.user._id;
      User.findById(bugFromDB.userId).then(bugOwner => {
        console.log({bugOwner});
        console.log({bugFromDB});
        res.render('bugDetails', { bug: bugFromDB, currentUser: req.user, isUserBug: isUserBug, bugOwner: bugOwner });
      })
    })
    .catch(error => {
        console.log(error);
    })
  });


router.get("/bugs/add", (req, res) => {
	res.render("/addBug");
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
	console.log(id);
	Bug.findById(id)
		.then((bugFromDB) => {
			// render an edit form with the data from the book
			console.log(bugFromDB);
			res.render("bugEditForm", { bug: bugFromDB });
		})
		.catch((error) => {
			console.log(error);
		});
});

  router.post('/bugs/edit/:id', uploader.single('bugEditImg'), (req, res) => {
    const imgName = req.file.originalname;
    const imgPath = req.file.url;
    const imgPublicId = req.file.public_id;
    let status = req.body.bugStatus
    const {description} = req.body;
    const id = req.params.id;
    Bug.findByIdAndUpdate(id, {
      description,
      imgName,
      imgPath,
      imgPublicId,
      status,
    })
    .then(bug => {
      res.redirect(`/bugs/${bug._id}`)
    })
    .catch(error => {
      console.log(error);
    })
  })

router.post("/bugs/edit/:id", (req, res) => {
	const { title, description, image } = req.body;
	const id = req.params.id; // req.user._id for you marlena
	Bug.findByIdAndUpdate(id, {
		title: title,
		description: description,
		image: image,
	})
		.then((bug) => {
			res.redirect(`/bugs/${bug._id}`);
		})
		.catch((error) => {
			console.log(error);
		});
});

module.exports = router;
