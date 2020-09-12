const express = require("express")
const router = express.Router()

/* GET home page */
router.get("/", (req, res, next) => {
	res.render("bug-area")
})

router.get("/firstSignin", (req, res, next) => {
	res.render("firstSignin")
})

module.exports = router
