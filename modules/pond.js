const mongoose = require("mongoose");

var pondSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// export Pond model
module.exports = mongoose.model("Pond", pondSchema);