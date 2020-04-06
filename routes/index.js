// Dependencies:
const express = require("express"),
      router = express.Router({mergeParams: true}),
      Comment = require("../modules/comment"),
      Pond = require("../modules/pond");


// Landing page
router.get("/", function(req, res){
    res.render("landing");
})


module.exports = router;