const ratingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');
const mongoose = require('mongoose');

//Create Rating
exports.createRating = async(req , res) =>{
    try{
        //get user Id
        const userId = req.user.id;

        //fetch data from req body
        const {rating , review  , courseId} = req.body;

        //check whether the user is enrolled in that course or not
        // Convert userId to ObjectId for proper comparison
        const userObjectId = new mongoose.Types.ObjectId(userId);
        
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $in: [userObjectId, userId] } // Check both ObjectId and string formats
        });

        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:"You are not enrolled in this course"
            })
        }

        //check if the user has already reviewed or not
        const alreadyReviewed = await ratingAndReview.findOne({user : userId , course : courseId});
        if(alreadyReviewed){
            return res.status(400).json({
                success:false,
                message:"You have already reviewed this course"
            })
        }

        //create rating and review
        const ratingReview = await ratingAndReview.create({
            rating ,
            review ,
            course : courseId,
            user : userId
        })

        //update course with this rating/review
        const updatedDetails = await Course.findByIdAndUpdate({_id: courseId} , {
            $push : {ratingAndReview : ratingReview._id}
        } , {new:true});

        console.log(updatedDetails);

        //return response
        return res.status(200).json({
            success:true,
            message:"Rating and review added successfully"
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Rating and review cannot be added , Please try again later..."
        })
    }
}

//Get Avg. Rating
exports.getAverageRating = async(req , res) =>{
    //get courseId
    const {courseId} = req.body;
    //calculate the average rating
    const result = await ratingAndReview.aggregate([
        { $match: { course: new mongoose.Types.ObjectId(courseId) } },  //To match the desired course
        { $group: { _id: "$course", averageRating: { $avg: "$rating" } } }   //Group the data according to the course and calculate the average rating
    ]);

    //return rating
    if(result.length > 0){
        return res.status(200).json({
            success:true,
            message:"Average rating fetched successfully",
            data:result[0].averageRating
        })
    }

    //if no rating reviews exist
    else{
        return res.status(200).json({
            success:true,
            message:"No ratings and reviews found for this course",
            data:0
        })
    }
}

//get All rating
exports.getAllRating = async(req , res) =>{
    try{
        const allRating = await ratingAndReview.find({})
            .sort({rating : "desc"})
            .populate({path : "user" , select : "firstName lastName email image"}).
            populate({path : "course" , select: "courseName"}).exec();
        return res.status(200).json({
            success:true,
            message:"All ratings fetched successfully",
            data:allRating
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Ratings cannot be fetched , Please try again later..."
        })
    }
}