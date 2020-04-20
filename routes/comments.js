// Dependencies:
const express = require("express"),
      router = express.Router({mergeParams: true}),
      Comment = require("../modules/comment"),
      Pond = require("../modules/pond"),
      middleware = require("../middleware");


// new - we don't need as the form is displayed on the pond show page

// create
router.post("/", middleware.isLoggedIn, function(req, res){
    // lookup pond using id from request
    Pond.findById(req.params.id, function(err, found_pond){
        if(err){
            req.flash("error", err.message);
        }
        Comment.create({
            text: req.body.comment_text,
            author: {
                id: req.user._id,
                username: req.user.username
            }
        }, function(err, created_comment){
            if(err){
                    req.flash("error", err.message);
                res.redirect("back");
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

// edit - we don't need as the edit form is displayed on the pond show page

// update

// destroy

module.exports = router;
