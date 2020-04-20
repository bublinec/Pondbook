// Dependencies:
const express = require("express"),
      passport = require("passport"),
      User = require("../modules/user"),
      router = express.Router({mergeParams: true});


// register form
router.get("/register", function(req, res){
    res.render("register");
});

// register logic
router.post("/register", function(req, res){
    newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, created_user){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        // if successfully create a user, then login and redirect
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Pondbook " + req.body.username + "!")
            res.redirect("/ponds");
        });
    });
});

// login form
router.get("/login", function(req, res){
    res.render("login");
});

// login lgic
router.post("/login", passport.authenticate("local", {
    successRedirect: "ponds",
    failureRedirect: "login"
}));

// log out
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "See you later!")
    res.redirect("/ponds");
});


module.exports = router;