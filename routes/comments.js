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

function isAuthorized(req, res, next){
    Pond.findById(req.params.id, function(err, foundPond){
        if(err){
            res.redirect("back");
        }
        else{
            // if current user owns the pond continue to next
            if(foundPond.author.id.equals(req.user._id)){
                next();
            }
            // else redirect back
            else{
                res.redirect("back");
            }
        }
    });
}

// COMMENT (RESTful routes)
// new - we don't need as the form is displayed on the pond show page

// create
router.post("/", isLoggedIn, function(req, res){
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

// edit - we don't need as the edit form is displayed on the pond show page

// update

// destroy

module.exports = router;
