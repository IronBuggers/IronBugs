const express = require("express")
const router = express.Router()

/* GET home page */
router.get("/bug-area", (req, res, next) => {
  console.log(req.user);
	res.render("bug-area", {currentUser : req.user})
})

router.get("/firstSignin", (req, res, next) => {
	res.render("firstSignin")
})

module.exports = router
