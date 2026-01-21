const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        trim: true
    },
    courseDescription: {
        type: String,
        required: true,
        trim: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // Co-instructors who can also teach this course (max 1 additional = 2 total)
    coInstructors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    whatYouWillLearn: {
        type: String,
    },
    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true
    }],
    ratingAndReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview"
    }],
    price: {
        type: Number,
    },
    thumbnail: {
        type: String,
        required: true
    },
    category: { // Changed from 'tag' to 'category'
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    tag:[{
        type : String,
    }],
    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    instructions: [{
        type: String
    }],
    status: {
        type: String,
        enum: ["Draft", "Published"],
    }

});

module.exports = mongoose.model("Course", courseSchema);