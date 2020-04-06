// SETUP
// Require packages:
const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      localStrategy = require("passport-local");

// Require models:
const Pond = require("./modules/pond"),
      Comment = require("./modules/comment"),
      User = require("./modules/user");

// DB configuration
mongoose.connect("mongodb://localhost/pondbook", {useNewUrlParser: true, useUnifiedTopology: true});
const seedDB = require("./seeds");
// seedDB();

// App configuration
app.use(express.static("public")); // include as used folder (wtih views)
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs");

// Passport configuration (order matters)
app.use(require("express-session")({
    secret: "This is a secret string used for hashing.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Start server
const port = 8000; 
app.listen(port, function(err){
    if(err){
        console.log("\nSomething went wrong:\n", err);     
    }
    else{
        console.log("Server listening on the port: ", port);
    }
})

// pass current_user to each template using middleware function
app.use(function(req, res, next){
    // whatever we put to locals is passed to the template
    res.locals.current_user = req.user;
    next();
});

// isLoggedIn middleware
function isLoggedIn(req, res, next){
    // if logged in continue to the next function
    if(req.isAuthenticated()){
        return next();
    }
    // else redirect to login
    res.redirect("/login");
}



// ROUTES
app.get("/", function(req, res){
    res.render("landing");
})

app.get("/ponds", function(req, res){
    Pond.find({}, function(err, all_ponds){
        if(err){
            console.log("\nSomething went wrong: \n", err);
        }
        else{
            res.render("index", {ponds: all_ponds});
        }
    })
})

app.post("/ponds", function(req, res){
    // get data from the form
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newPond = {name: name, image:image, description:description}; 
    // create pond and save it to db
    Pond.create(newPond, function(err, created_pond){
        if(err){
            console.log("\nSomething went wrong: \n", err);
        }
        else{
            console.log("\nCreated a new pond: \n", created_pond);
            // redirect to ponds page
            res.redirect("/ponds");
        }
    })
})

app.get("/ponds/new", function(req, res){
    res.render("new")
})

app.get("/ponds/:id", function(req, res){
    // find the pond with provided id
    Pond.findById(req.params.id).populate("comments").exec(function(err, found_pond){
        if(err){
            console.log("\nSomething went wrong: \n", err);
        }
        else{        
            // render the show page for that id
            res.render("show", {pond: found_pond});
        }
    });
});

// Comments
app.post("/ponds/:id/comments", isLoggedIn, function(req, res){
    // lookup pond using id from request
    Pond.findById(req.params.id, function(err, found_pond){
        if(err){
            console.log(err)
        }
        Comment.create({
            text: req.body.comment_text,
            author: "Homer" // will be the signed user eventually
        }, function(err, created_comment){
            if(err){
                console.log(err);
            }
            else{
                // connect comment to the pond
                found_pond.comments.push(created_comment);
                found_pond.save();
                // redirect to show (to refresh)
                res.redirect("/ponds/" + req.params.id);
            }
        })
    })
})


// AUTH ROUTES
// register form
app.get("/register", function(req, res){
    res.render("register")
})

// register logic
app.post("/register", function(req, res){
    newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, created_user){
        if(err){
            console.log(err);
            return res.render("/register")
        }
        // if successfully create a user, then login and redirect
        passport.authenticate("local")(req, res, function(){
            res.redirect("/ponds")
        });
    })
})

// login form
app.get("/login", function(req, res){
    res.render("login")
})

// login lgic
app.post("/login", passport.authenticate("local", {
    successRedirect: "ponds",
    failureRedirect: "login"
}));

// log out
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/ponds");
})