const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");

/* GET home page */
router.get("/signup", (req, res, next) => {
	res.render("signup");
});

// router.get("/firstSignin", (req, res, next) => {
// 	res.render("firstSignin")
// })

router.get("/github", passport.authenticate("github"));

router.get(
	"/auth/github/callback",
	passport.authenticate("github", {
		successRedirect: "/bugArea",
		failureRedirect: "/",
	})
);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), function (
	req,
	res
) {
	res.redirect("/bugArea");
});

router.post("/signup", (req, res, next) => {
	const { email, password } = req.body;
	if (password.length < 8) {
		res.render("signup", { message: "Your password needs to be 8 chars min" });
		return;
	}
	if (email === "") {
		res.render("signup", { message: "Your email cannot be empty" });
		return;
	}
	User.findOne({ email: email }).then((found) => {
		if (found !== null) {
			res.render("signup", { message: "This email is already taken" });
		} else {
			const salt = bcrypt.genSaltSync();
			const hash = bcrypt.hashSync(password, salt);

			User.create({
				email: email,
				password: hash,
			}).then((dbUser) => {
				res.redirect("/");
			});
		}
	});
});

router.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/bugArea",
		failureRedirect: "/",
		passReqToCallBack: true,
	})
);

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

module.exports = router;
