// Dependencies:
const express = require("express"),
      router = express.Router({mergeParams: true}),
      Comment = require("../modules/comment"),
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

// PONDS (RESTful routes)
// index 
router.get("/", function(req, res){
    Pond.find({}, function(err, all_ponds){
        if(err){
            console.log(err);
        }
        else{
            res.render("ponds/index", {ponds: all_ponds});
        }
    });
});

// new
router.get("/new", isLoggedIn, function(req, res){
    res.render("ponds/new");
});

// create
router.post("/", isLoggedIn, function(req, res){ 
    // create pond and save it to db
    pond = req.body.pond;
    pond.author = {
        id: req.user._id,
        username: req.user.username
    } 
    Pond.create(req.body.pond, function(err, created_pond){
        if(err){
            console.log(err);
        }
        else{
            console.log("\nCreated pond:\n", created_pond);
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
            res.render("ponds/show", {pond: found_pond});
        }
    });
});

// edit (form)
router.get("/:id/edit", function(req, res){
    Pond.findById(req.params.id, function(err, foundPond){
        if(err){
            res.render("ponds/show");
        }
        else{
            res.render("ponds/edit", {pond: foundPond});
        }
    });
});

// update (where form submits to)
router.put("/:id", function(req, res){
    // find and update the pond
    Pond.findByIdAndUpdate(req.params.id, req.body.pond, function(err, updatedPond){
        if(err){
            res.render("ponds/edit", {pond: foundPond});
        }
        // redirect to show
        else{
            console.log("here");
            
            res.redirect(req.params.id);
        }
    });
});

// destroy
router.delete("/:id", function(req, res){
    Pond.findById(req.params.id, function(err, foundPond){
        if(err){
            res.render("ponds/show");
        }
        else{
            // remove all comments 
            foundPond.comments.forEach(function(comment){
                Comment.findByIdAndRemove(comment, function(err, removedComment){
                    if(err){
                        console.log(err);
                    }
                });
            });
            // remove the pond itself
            foundPond.remove();
            // redirect to index
            res.redirect("/ponds");
        }
    })
})


// COMMETNS
router.post("/:id/comments", isLoggedIn, function(req, res){
    // lookup pond using id from request
    Pond.findById(req.params.id, function(err, found_pond){
        if(err){
            console.log(err);
        }
        Comment.create({
            text: req.body.comment_text,
            author: {
                id: req.user._id,
                username: req.user.username
            }
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