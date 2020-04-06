// SETUP

// Require packages:
const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose");

      
// Require models:
const Pond = require("./modules/pond"),
      Comment = require("./modules/comment");

// DB configuration
mongoose.connect("mongodb://localhost/pondbook", {useNewUrlParser: true, useUnifiedTopology: true});
const seedDB = require("./seeds");
seedDB();

// App configuration
app.use(express.static("public")); // include as used folder (wtih views)
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs");

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
            console.log(found_pond);
        
            // render the show page for that id
            res.render("show", {pond: found_pond});
        }
    });
});

// Comments
app.post("/ponds/:id/comments", function(req, res){
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