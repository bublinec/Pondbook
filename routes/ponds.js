// Dependencies:
const express = require("express"),
      router = express.Router({mergeParams: true}),
      Comment = require("../modules/comment"),
      Pond = require("../modules/pond"),
      middleware = require("../middleware");


// index 
router.get("/", function(req, res){
    Pond.find({}, function(err, all_ponds){
        if(err){
            req.flash("error", err.message);
            res.render("ponds/show");
        }
        else{
            res.render("ponds/index", {ponds: all_ponds});
        }
    });
});

// new
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("ponds/new");
});

// create
router.post("/", middleware.isLoggedIn, function(req, res){ 
    // create pond and save it to db
    pond = req.body.pond;
    pond.author = {
        id: req.user._id,
        username: req.user.username
    } 
    Pond.create(req.body.pond, function(err, created_pond){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            console.log("\nCreated pond:\n", created_pond);
            // redirect to ponds page with a success flash message
            req.flash("success", "Pond created!");
            res.redirect("/ponds");
        }
    });
});

// show
router.get("/:id", function(req, res){
    // find the pond with provided id
    Pond.findById(req.params.id).populate("comments").exec(function(err, found_pond){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{        
            // render the show page for that id
            res.render("ponds/show", {pond: found_pond});
        }
    });
});

// edit (form)
router.get("/:id/edit", middleware.isLoggedIn, middleware.isAuthorized, function(req, res){
    Pond.findById(req.params.id, function(err, foundPond){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            res.render("ponds/edit", {pond: foundPond});
        }
    });
});

// update (where form submits to)
router.put("/:id", middleware.isLoggedIn, middleware.isAuthorized, function(req, res){
    // find and update the pond
    Pond.findByIdAndUpdate(req.params.id, req.body.pond, function(err, updatedPond){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        // redirect to show
        else{
            console.log("here");
            // redirect with a succes flash message
            req.flash("success", "Pond updated!");
            res.redirect(req.params.id);
        }
    });
});

// destroy
router.delete("/:id", middleware.isLoggedIn, middleware.isAuthorized, function(req, res){
    Pond.findById(req.params.id, function(err, foundPond){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            // remove all comments 
            foundPond.comments.forEach(function(comment){
                Comment.findByIdAndRemove(comment, function(err, removedComment){
                    if(err){
                                    req.flash("error", err.message);
                        res.redirect("back");
                    }
                });
            });
            // remove the pond itself
            foundPond.remove();
            // redirect to index with a succes flash message
            req.flash("success", "Pond delted!");
            res.redirect("/ponds");
        }
    })
})


module.exports = router;