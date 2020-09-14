const express = require("express")
const router = express.Router()

/* GET home page */
router.get("/bugArea", (req, res, next) => {
  console.log(req.user);
	res.render("bugArea", {currentUser : req.user})
})

router.get("/firstSignin", (req, res, next) => {
	res.render("firstSignin")
})

router.get("/userProfile", (req, res, next) => {
	res.render("userProfile", { currentUser: req.user })
})

router.get("/addBug", (req, res, next) => {
	res.render("addBug")
})

// router.get("/bugDetails", (req, res, next) => {
// 	res.render("firstSignin")
// })

module.exports = router
