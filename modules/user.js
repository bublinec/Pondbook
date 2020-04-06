const mongoose = require("mongoose"),
      passportLocalMongoose = require("passport-lcoal-mongoose"); 

var userSchema = new mongooose.Schema({
    username = String,
    passport = String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);