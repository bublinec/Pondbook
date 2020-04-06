// Dependencies:
const express = require("express"),
      router = express.Router({mergeParams: true});
      

// Landing page
router.get("/", function(req, res){
    res.render("landing");
})


module.exports = router;