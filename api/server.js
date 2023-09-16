let express = require("express");
let cors = require("cors");
var mongoose = require("mongoose");
var session = require("express-session");
let app = express();
var bodyParser = require("body-parser");
let assert = require("assert");
const dbConfig = require("./config/db.config");
require('dotenv').config()
console.log(dbConfig);
var corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
};
app.use(cors(corsOptions));
const db1 = require("./models");
const User = db1.user;
//! Session
app.use(
  session({
    secret: "keyboard cat",
    cookie: {
      secure: false,
      sameSite: false
    },
    // expires: new Date() + 60000,
  })
);
//! passportjs
const passport = require("passport");
var GoogleStrategy = require('passport-google-oidc');
passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log(id);
  User.find({ googleId: id }).then(user => {
    done(null, user);
  });
});
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true,
  })
);
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    function (issuer, profile, cb) {
      console.log(profile);
      User.findOrCreate({ googleId: profile.id, username: profile.displayName }, function (err, user) {
        console.log(user);
        console.log(err);
        var user1 = {
          id: profile.id.toString(),
          name: profile.displayName
        };
        return cb(null, user1);
      });

    }
  )
);

app.use(passport.initialize());
app.use(passport.session());





app.get("/", (req, res) => {
  res.json({
    message:
      "Welcome on Share api, to learn more about Share : https://github.com/Firelods/ShareAPI",
  });
  res.end();
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

var secret = "bezkoder-secret-key";
const db = require("./models");
db.mongoose
  .connect(
    `mongodb+srv://${dbConfig.USERNAME}:${dbConfig.PASSWORD}@sharedb.mpsacc3.mongodb.net/Share?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });
db.mongoose.db;
require("./routes/auth.routes")(app);
require("./routes/group.routes")(app);
require("./routes/user.routes")(app);
