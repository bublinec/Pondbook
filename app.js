// SETUP
const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      port = 8000;

mongoose.connect("mongodb://localhost/pondbook", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.static("public")); // include as used folder (wtih views)
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs");

// Start server
app.listen(port, function(err){
    if(err){
        console.log("\nSomething went wrong:\n", err);     
    }
    else{
        console.log("Server listening on the port: ", port);
    }
})


// SCHEMA SETUP
var pondSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

// COMPILE TO A MODEL
var Pond = mongoose.model("Pond", pondSchema);

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
    Pond.findById(req.params.id, function(err, found_pond){
        if(err){
            console.log("\nSomething went wrong: \n", err);
        }
        else{
            // render the show page for that id
            res.render("show", {pond: found_pond});
        }
    })
})