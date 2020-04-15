const mongoose = require("mongoose"),
      faker = require("faker"),
      Pond = require("./modules/pond"),
      Comment = require("./modules/comment")
      data = [
{
    name: "Salmon Creek", 
    image: "https://geartrench.com/wp-content/uploads/2019/09/Koi-Pond-Ideas.jpeg",
    description: "A pond is a small area of still, fresh water. It is different from a river or a stream because it does not have moving water and it differs from a lake because it has a small area and is no more than around 1.8m deep.",
    comments: []
},
    {
    name: "Charlie's Pond", 
    image: "https://easypro.com/wp-content/uploads/2019/09/Allendale-Ponds-picSM2-1024x768.jpg",
    description: "A pond is a small area of still, fresh water. It is different from a river or a stream because it does not have moving water and it differs from a lake because it has a small area and is no more than around 1.8m deep.",  
    comments: []
},
    {
    name: "Frog's lake", 
    image: "https://i2-prod.cambridge-news.co.uk/incoming/article12224230.ece/ALTERNATES/s1200b/Pond-installation.png",
    description: "A pond is a small area of still, fresh water. It is different from a river or a stream because it does not have moving water and it differs from a lake because it has a small area and is no more than around 1.8m deep.",     
    comments: []
},
    {
    name: "Heart Pond", 
    image: "https://www.ntlabs.co.uk/vendor/timthumb/timthumb.php?src=/library/images/5b3ddc7762fdb-new-pond.jpg&w=640",
    description: "A pond is a small area of still, fresh water. It is different from a river or a stream because it does not have moving water and it differs from a lake because it has a small area and is no more than around 1.8m deep.",     
    comments: []
},
    {
    name: "Summer Oasis", 
    image: "https://www.cedarlawnandlandscaping.com/uploads/5/6/3/4/56347855/newpond_orig.jpg",
    description: "A pond is a small area of still, fresh water. It is different from a river or a stream because it does not have moving water and it differs from a lake because it has a small area and is no more than around 1.8m deep.",     
    comments: []
},
    {
    name: "Lili's Mountain Lake", 
    image: "https://cdn8.bigcommerce.com/s-ht04jpyn2r/product_images/uploaded_images/B_I_Recreational_001_thumbnail.jpg",
    description: "A pond is a small area of still, fresh water. It is different from a river or a stream because it does not have moving water and it differs from a lake because it has a small area and is no more than around 1.8m deep.",     
    comments: []
},
    {
    name: "Stone Pond", 
    image: "https://pondwiki.com/wp-content/uploads/2019/08/Koi-pond-with-three-different-depth.jpg",
    description: "A pond is a small area of still, fresh water. It is different from a river or a stream because it does not have moving water and it differs from a lake because it has a small area and is no more than around 1.8m deep.",     
    comments: []
},
    {
    name: "Fountain Pond", 
    image: "https://www.lakemanagementinc.net/wp-content/uploads/2019/04/koi-pond-construction.jpg",
    description: "A pond is a small area of still, fresh water. It is different from a river or a stream because it does not have moving water and it differs from a lake because it has a small area and is no more than around 1.8m deep.",     
    comments: []
},
    {
    name: "Koi Paradise", 
    image: "https://resources.mynewsdesk.com/image/upload/c_limit,dpr_2.625,f_auto,h_700,q_auto,w_380/psmwatsxyoccnkfuiigx.jpg",
    description: "A pond is a small area of still, fresh water. It is different from a river or a stream because it does not have moving water and it differs from a lake because it has a small area and is no more than around 1.8m deep.", 
    comments: []
},
];


function seedDB(){
   //Remove all ponds
   Pond.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed ponds!");
        Comment.deleteMany({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few ponds
            data.forEach(function(seed){
                Pond.create(seed, function(err, pond){
                    if(err){
                        console.log(err)
                    } else {
                        //create a comment
                        // Comment.create(
                        //     {
                        //         text: "This place is great, but I wish there was internet",
                        //         author: "Homer"
                        //     }, function(err, comment){
                        //         if(err){
                        //             console.log(err);
                        //         } else {
                        //             pond.comments.push(comment);
                        //             pond.save();
                        //             console.log("generated a comment");
                        //         }
                        //     });
                    }
                });
            });
        console.log("DB seeded");
        });
    }); 
    //add a few comments
}

module.exports = seedDB;