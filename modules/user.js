const mongoose = require("mongoose"),
      passportLocalMongoose = require("passport-local-mongoose"); 

var userSchema = new mongoose.Schema({
    username: String,
    passport: String
});

// add bunch of methods necessary for authentication to userSchema object
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);