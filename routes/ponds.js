// Dependencies:
const express = require("express"),
      router = express.Router({mergeParams: true}),
      Pond = require("../modules/pond");


// Functions:
function isLoggedIn(req, res, next){
    // if logged in continue to the next function
    if(req.isAuthenticated()){
        return next();
    }
    // else redirect to login
    res.redirect("/login");
}


// index 
router.get("/", function(req, res){
    Pond.find({}, function(err, all_ponds){
        if(err){
            console.log(err);
        }
        else{
            res.render("index", {ponds: all_ponds});
        }
    });
});

// new
router.get("/new", function(req, res){
    res.render("new");
});

// create
router.post("/", function(req, res){ 
    // create pond and save it to db
    Pond.create(req.body.pond, function(err, created_pond){
        if(err){
            console.log(err);
        }
        else{
            console.log(created_pond);
            // redirect to ponds page
            res.redirect("/ponds");
        }
    });
});

// show
router.get("/:id", function(req, res){
    // find the pond with provided id
    Pond.findById(req.params.id).populate("comments").exec(function(err, found_pond){
        if(err){
            console.log(err);
        }
        else{        
            // render the show page for that id
            res.render("show", {pond: found_pond});
        }
    });
});

// pond comments
router.post(":id/comments", isLoggedIn, function(req, res){
    // lookup pond using id from request
    Pond.findById(req.params.id, function(err, found_pond){
        if(err){
            console.log(err);
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
        });
    });
});


module.exports = router;