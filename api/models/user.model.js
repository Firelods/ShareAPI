const mongoose = require("mongoose");
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    session: String,
    googleId: String,
  }).plugin(require('mongoose-findorcreate'))
);

module.exports = User;