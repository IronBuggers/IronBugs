const express = require('express');
const router  = express.Router();
const Bug = require('../models/Bug');
const middleware = require('./middlewares');
const { uploader, cloudinary } = require("../config/cloudinary.js");


router.get("/addBug", (req, res, next) => {
	res.render("addBug")
})

router.post('/bugs', uploader.single('bugImg'), async (req, res) => {
  const imgName = req.file.originalname;
  const imgPath = req.file.url;
  const imgPublicId = req.file.public_id;
  let anonym = req.body.anonym
  if (anonym === 'on') {
    anonym = true
  } else {
    anonym = false
  }
  // console.log('I am in');
  // let bugCounter = Bug.count({}, function(error, numOfDocs) {
  //   if (error) console.log("Count is not working");
  //   console.log(numOfDocs);
  // })
  let bugCounter = await Bug.find()
  const {title, description, image} = req.body;
  Bug.create({
    title,
    description,
    imgName,
    imgPath,
    imgPublicId,
    anonym,
    userId: req.user._id,
    bugnumber: bugCounter.length +1,
  }).then(bug => {
    console.log(`new Bug is here: ${bug}`);
    res.redirect(`/bugs/${bug._id}`)
  }).catch(error => {
    console.log(error);
  })
});

router.get('/bugArea', middleware.loginCheck(), (req, res, next) => {
    
  Bug.find().then(bugsFromDB => {
    console.log('This is bugs',bugsFromDB);
    console.log(req.session.user);
    res.render('bugArea', { bugsList: bugsFromDB, currentUser: req.user})

  })
  
  .catch(error => {
      console.log(error);
  })
});

router.get('/bugs/add', (req, res) => {
    res.render('/addBug')
  });

router.get('/bugs/:id', (req, res) => {
    const id = req.params.id
    Bug.findById(id).then(bugFromDB => {
      let isUserBug = '' + bugFromDB.userId == '' + req.user._id
      console.log(bugFromDB.userId);
      console.log(req.user._id);
      console.log(isUserBug);
      res.render('bugDetails', { bug: bugFromDB, currentUser: req.user, isUserBug: isUserBug });
    })
    .catch(error => {
        console.log(error);
    })
  });



  router.get('/bugs/edit/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    Bug.findById(id)
      .then(bugFromDB => {
        // render an edit form with the data from the book
        console.log(bugFromDB);
        res.render('bugEditForm', { bug: bugFromDB })
      })
      .catch(error => {
        console.log(error);
      })
  });

  router.post('/bugs/edit/:id', uploader.single('bugEditImg'), (req, res) => {
    const imgName = req.file.originalname;
    const imgPath = req.file.url;
    const imgPublicId = req.file.public_id;
    const {description} = req.body;
    const id = req.params.id;
    Bug.findByIdAndUpdate(id, {
      description,
      imgName,
      imgPath,
      imgPublicId,
    })
    .then(bug => {
      res.redirect(`/bugs/${bug._id}`)
    })
    .catch(error => {
      console.log(error);
    })
  })

  router.get('/bugs/delete/:id', (req, res) => {
    const id = req.params.id
    Bug.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/bugArea');
    })
    .catch(error => {
      console.log(error);
    })
  })

module.exports = router;