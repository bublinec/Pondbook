// Dependencies:
const express = require("express"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      bodyParser = require("body-parser"),
      localStrategy = require("passport-local"),
      methodOverride = require("method-override");

// Models:
const Pond = require("./modules/pond"),
      User = require("./modules/user"),
      Comment = require("./modules/comment");

// Routes:
const authRoutes = require("./routes/auth"),
      pondRoutes = require("./routes/ponds"),
      indexRoutes = require("./routes/index");

// DB:
mongoose.connect("mongodb://localhost/pondbook", {useNewUrlParser: true, useUnifiedTopology: true});
// const seedDB = require("./seeds");
// seedDB();

// App configuration
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"))
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

// pass current_user to each template (using middleware function)
app.use(function(req, res, next){
    // whatever is in locals will be passed to the template
    res.locals.current_user = req.user;
    next(); // proceed to the next function
});

// routes
app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/ponds", pondRoutes);


// Start server
const port = 8000; 
app.listen(port, function(err){
    if(err){
        console.log(err);     
    }
    else{
        console.log("Server listening on the port: ", port);
    }
});