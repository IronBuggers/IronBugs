const express = require("express")
const router = express.Router()

/* GET home page */

router.get("/userProfile", (req, res, next) => {
	res.render("userProfile", { currentUser: req.user})
})



// router.get("/bugDetails", (req, res, next) => {
// 	res.render("firstSignin")
// })

module.exports = router
