const express = require("express")
const router = express.Router()
const User = require('../models/User');
const bcrypt = require('bcrypt')
const passport = require('passport');

/* GET home page */
router.get("/signup", (req, res, next) => {
	res.render("signup")
})

router.get('/github', passport.authenticate('github'));

router.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
)

router.post('/signup', (req, res, next) => {
  const { email, password } = req.body;
  console.log(email);
  if (password.length < 8) {
    res.render('signup', { message: 'Your password needs to be 8 chars min' });
    return;
  }
  if (email === '') {
    res.render('signup', { message: 'Your email cannot be empty' });
    return;
  }
  User.findOne({ email: email })
    .then(found => {
      if (found !== null) {
        res.render('signup', { message: 'This email is already taken' });
      } else {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);

        User.create({
          email: email,
          password: hash
        })
          .then(dbUser => {
            res.redirect('/');
          })
      }
    })

});

router.post('/login', (req, res, next) => {
  console.log('Wir sind im Pfad Login');
  const { email, password } = req.body;
  console.log(req.body);
  User.findOne({ email: email })
    .then(found => {

      if (found === null) {
        res.render('index', { message: 'Invalid credentials' });
        return;
      }

      if (bcrypt.compareSync(password, found.password)) {

        req.session.user = found;
        console.log('ICH BIN DER USER ', req.session);
        // Abfrage ob User.firstTime === true

        if(found.firstSignin){
          res.redirect('/firstSignin')
        } else {
          res.redirect('/bug-area');
        }

      } else {
        res.render('index', { message: 'Invalid credentials' });
      }
    })
    .catch(error => {
      next(error);
    })
});

router.get('/logout', (req, res) => {
  req.session.destroy(error => {
    if (error) {
      next(error);
    } else {
      res.redirect('/');
    }
  })
})

module.exports = router
