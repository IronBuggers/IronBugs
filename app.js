require("dotenv").config()

const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const express = require("express")
const favicon = require("serve-favicon")
const hbs = require("hbs")
const mongoose = require("mongoose")
const logger = require("morgan")
const path = require("path")

mongoose
	.connect("mongodb://localhost/ironbugs", { useNewUrlParser: true, useUnifiedTopology: true })
	.then((x) => {
		console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
	})
	.catch((err) => {
		console.error("Error connecting to mongo", err)
	})

const app_name = require("./package.json").name
const debug = require("debug")(`${app_name}:${path.basename(__filename).split(".")[0]}`)

const app = express()

// Middleware Setup
app.use(logger("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())


// session configuration
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    saveUninitialized: false,
    resave: true,
    store: new MongoStore({
      // when the session cookie has an expiration date
      // connect-mongo will use it, otherwise it will create a new
      // one and use ttl - time to live - in that case one day
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 * 1000
    })
  })
)
// End of Session config

const User = require('./models/User');
const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcrypt');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(dbUser => {
      done(null, dbUser);
    })
    .catch(error => {
      done(error);
    })
});

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: 'http://127.0.0.1:3000/auth/github/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      // find a user with profile.id as githubId or create one
      console.log(profile);
      User.findOne({ githubId: profile.id })
        .then(found => {
          if (found !== null) {
            // user already exists
            done(null, found);
          } else {
            // no user with that github id
            return User.create({ githubId: profile.id, name: profile._json.login, avatar: profile._json.avatar_url }).then(dbUser => {
              done(null, dbUser);
            })
          }
        })
        .catch(error => {
          done(error);
        })
    }
  )
)

app.use(passport.initialize());
app.use(passport.session());



// Express View engine setup

app.use(
	require("node-sass-middleware")({
		src: path.join(__dirname, "public"),
		dest: path.join(__dirname, "public"),
		sourceMap: true,
	})
)

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "hbs")
app.use(express.static(path.join(__dirname, "public")))
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")))

// default value for title local
app.locals.title = "Express - Generated with IronGenerator"

const index = require("./routes/index")
app.use("/", index)

const auth = require("./routes/auth")
app.use("/", auth)

const bugArea = require("./routes/bugArea")
app.use("/", bugArea)

module.exports = app