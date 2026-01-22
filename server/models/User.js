const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        trim : true
    },
    lastName : {
        type : String,
        required : true,
        trim : true
    },
    email :{
        type : String,
        required : true,
        trim : true
    },
    password:{
        type : String ,
        required : true,
    },
    accountType : {
        type : String ,
        enum : ["Admin" , "Student" , "Instructor"],
        required : true
    },
    // Instructor verification fields
    isVerified: {
        type: Boolean,
        default: function() {
            // Students and Admins are verified by default, Instructors need verification
            return this.accountType !== "Instructor";
        }
    },
    verificationStatus: {
        type: String,
        enum: ["pending", "approved", "rejected", "not_required"],
        default: function() {
            return this.accountType === "Instructor" ? "pending" : "not_required";
        }
    },
    verificationDocuments: {
        qualification: { type: String },  // Cloudinary URL for qualification certificate
        experience: { type: String },      // Years of experience or description
        expertise: [{ type: String }],     // Areas of expertise
        linkedIn: { type: String },        // LinkedIn profile URL
        portfolio: { type: String },       // Portfolio/website URL
        bio: { type: String }              // Brief bio about teaching experience
    },
    verificationRequestedAt: {
        type: Date
    },
    verifiedAt: {
        type: Date
    },
    rejectionReason: {
        type: String
    },
    additionalDetails:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"Profile",
    },
    token : {
        type : String,
    },
    resetPasswordExpires:{
        type : Date,
    },
    courses : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Course"
    }],
    image:{
        type : String ,
        required : true
    },
    courseProgress : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"CourseProgress"
    }
}, { timestamps: true });

module.exports=mongoose.model("User" , userSchema);