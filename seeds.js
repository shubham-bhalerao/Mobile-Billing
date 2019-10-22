var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");

var data=[{
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhF0aA7Z_oRURIXDGJlC8zT6eAx6kgkbQd5d7BITMYjmrjc5wH",
    name:"Mahabaleshwar",
    description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis auctor quis dui at feugiat. Integer faucibus risus leo, sit amet ultricies ante facilisis ac. Maecenas vestibulum lacus quam, non varius elit condimentum id. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris molestie libero risus, sit amet sodales lacus sodales vitae. Nulla tristique sodales neque ac mollis. Cras maximus consectetur iaculis."
},{
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv9n8b2hjD26vxj1jcjSOQk-rgsxZoAvH6LHeUMen7tGOCH6iOww",
    name:"Matheran",
    description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis auctor quis dui at feugiat. Integer faucibus risus leo, sit amet ultricies ante facilisis ac. Maecenas vestibulum lacus quam, non varius elit condimentum id. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris molestie libero risus, sit amet sodales lacus sodales vitae. Nulla tristique sodales neque ac mollis. Cras maximus consectetur iaculis."
},{
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQjhcILcre6ULGOLhRyN2YkI3xaC-9yYU3x1ao_ODJRBzRzgqu",
    name:"Pachgani",
    description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis auctor quis dui at feugiat. Integer faucibus risus leo, sit amet ultricies ante facilisis ac. Maecenas vestibulum lacus quam, non varius elit condimentum id. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris molestie libero risus, sit amet sodales lacus sodales vitae. Nulla tristique sodales neque ac mollis. Cras maximus consectetur iaculis."
}];
async function seedDB(){
    try {
        await Campground.remove({});
        console.log('Campgrounds removed');
        await Comment.remove({});
        console.log('Comments removed');

        // for(const seed of data) {
        //     let campground = await Campground.create(seed);
        //     console.log('Campground created');
        //     let comment = await Comment.create(
        //         {
        //             text: 'This place is great, but I wish there was internet',
        //             author: 'Homer'
        //         }
        //     )
        //     console.log('Comment created');
        //     campground.comments.push(comment);
        //     campground.save();
        //     console.log('Comment added to campground');
        // }
    } catch(err) {
        console.log(err);
    }
}

module.exports=seedDB;