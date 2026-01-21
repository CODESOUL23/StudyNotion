const Course = require("../models/Course");
const Category = require("../models/category"); // Updated from Tag
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Create Course handler function
exports.createCourse = async (req, res) => {
    try {
        // Fetch data
        const { courseName, courseDescription, tag  , whatYouWillLearn, price, category } = req.body; // Changed 'tag' to 'category'

        // Get thumbnail
        const thumbnail = req.files.thumbnailImage;

        // Validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !tag || !price || !category || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details"
            });
        }

        // Check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findOne({ _id: userId });
        console.log("Instructor Details : ", instructorDetails);

        if (!instructorDetails) {
            return res.status(400).json({
                success: false,
                message: "Instructor not found"
            });
        }

        // Check given category is valid or not?
        const categoryDetails = await Category.findById({ _id: category }); // Updated from Tag
        if (!categoryDetails) {
            return res.status(400).json({
                success: false,
                message: "Invalid Category"
            });
        }

        // Upload Image to Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // Create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tag:tag,
            category: categoryDetails._id, // Updated from 'tag'
            thumbnail: thumbnailImage.secure_url
        });

        // Add the new course to the instructor's course list
        await User.findOneAndUpdate({ _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id
                }
            });

        // Update the category schema
        await Category.findOneAndUpdate({ _id: categoryDetails._id }, // Updated from Tag
            {
                $push: {
                    courses: newCourse._id // Changed from 'course' to 'courses' to match schema
                }
            });

        // Return res
        res.status(200).json({
            success: true,
            message: "Course created successfully",
            data : newCourse
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Course cannot be created, Please try again later..."
        });
    }
}

exports.showAllCourses = async(req , res) => {
    try {
        const allCourses = await Course.find({} ,
            {
            courseName:true,
            courseDescripion:true,
            whatYouWillLearn:true,
            price:true,
            tag:true,
            thumbnail:true
        }).populate("instructor").exec();

        return res.status(200).json({
            success: true,
            message: "All Courses fetched successfully",
            allCourses,
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Courses cannot be fetched, Please try again later"
        })
    }
}

exports.getCourseDetails = async(req ,res) => {
    try{
            //get ID
            const {courseId} = req.body;
            //find the course details
            const courseDetails = await Course.findOne(
                {_id : courseId})
                .populate({
                    path : "instructor",
                    populate:{
                        path : "additionalDetails"
                    }
                }
            )
                .populate("category")
                .populate("ratingAndReviews")
                .populate("coInstructors", "firstName lastName _id image")
                .populate({
                path:"courseContent",
                populate:{
                    path : "subSection"
               }
            }).exec();

        //validation
            if(!courseDetails){
                return res.status(404).json({
                    success:false,
                    message:"Course not found"
                })
            }
        //return response
        return res.status(200).json({
            success : true,
            message : "Course details fetched successfully",
            data : {
                courseDetails: courseDetails
            },
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Course details cannot be fetched , Please try again later..."
        })
    }
}

// Get full course details for enrolled students (authenticated)
exports.getFullCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        const courseDetails = await Course.findOne({ _id: courseId })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails"
                }
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            })
            .exec();

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Get course progress for the user
        const CourseProgress = require("../models/CourseProgress");
        let courseProgressCount = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        });

        const completedVideos = courseProgressCount?.completedVideos || [];

        return res.status(200).json({
            success: true,
            data: {
                courseDetails: courseDetails,
                completedVideos: completedVideos,
            },
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Course details cannot be fetched, Please try again later..."
        });
    }
}

// Get all courses created by an instructor
exports.getInstructorCourses = async (req, res) => {
    try {
        const instructorId = req.user.id;

        // Find all courses where user is the main instructor OR a co-instructor
        const instructorCourses = await Course.find({
            $or: [
                { instructor: instructorId },
                { coInstructors: instructorId }
            ]
        })
        .sort({ createdAt: -1 })
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        })
        .populate("instructor", "firstName lastName")
        .populate("coInstructors", "firstName lastName")
        .exec();

        return res.status(200).json({
            success: true,
            data: instructorCourses,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch instructor courses",
            error: error.message,
        });
    }
}

// Edit Course Details
exports.editCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const updates = req.body;
        
        console.log("Edit Course - courseId:", courseId);
        console.log("Edit Course - updates keys:", Object.keys(updates));
        
        const course = await Course.findById(courseId);
        
        if (!course) {
            console.log("Edit Course - Course not found");
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
        
        console.log("Edit Course - Found course:", course.courseName);

        // If thumbnail image is provided, upload to Cloudinary
        if (req.files && req.files.thumbnailImage) {
            console.log("Edit Course - Uploading new thumbnail");
            const thumbnail = req.files.thumbnailImage;
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            );
            course.thumbnail = thumbnailImage.secure_url;
        }

        // Update only the fields that are present in the request body
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                if (key === "tag" || key === "instructions") {
                    // Handle both string (JSON) and already-parsed array
                    try {
                        course[key] = typeof updates[key] === 'string' 
                            ? JSON.parse(updates[key]) 
                            : updates[key];
                        console.log(`Edit Course - Updated ${key}:`, course[key]);
                    } catch (parseError) {
                        // If parse fails, use value as-is
                        console.log(`Edit Course - Parse failed for ${key}, using as-is`);
                        course[key] = updates[key];
                    }
                } else if (key !== "courseId" && key !== "thumbnailImage") {
                    course[key] = updates[key];
                }
            }
        }

        console.log("Edit Course - Saving course...");
        await course.save();
        console.log("Edit Course - Course saved successfully");

        const updatedCourse = await Course.findById(courseId)
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to edit course",
            error: error.message,
        });
    }
}

// Enroll as Co-Instructor (max 2 instructors per course)
exports.enrollAsInstructor = async (req, res) => {
    try {
        const { courseId } = req.body;
        const instructorId = req.user.id;

        // Find the course
        const course = await Course.findById(courseId);
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Check if user is the primary instructor
        if (course.instructor.toString() === instructorId) {
            return res.status(400).json({
                success: false,
                message: "You are already the primary instructor of this course"
            });
        }

        // Check if already a co-instructor
        if (course.coInstructors && course.coInstructors.includes(instructorId)) {
            return res.status(400).json({
                success: false,
                message: "You are already a co-instructor of this course"
            });
        }

        // Check if max instructors reached (1 primary + 1 co-instructor = 2 total)
        if (course.coInstructors && course.coInstructors.length >= 1) {
            return res.status(400).json({
                success: false,
                message: "This course already has the maximum number of instructors (2)"
            });
        }

        // Add as co-instructor
        if (!course.coInstructors) {
            course.coInstructors = [];
        }
        course.coInstructors.push(instructorId);
        await course.save();

        // Add course to instructor's courses list
        const User = require("../models/User");
        await User.findByIdAndUpdate(instructorId, {
            $push: { courses: courseId }
        });

        // Return updated course
        const updatedCourse = await Course.findById(courseId)
            .populate("instructor", "firstName lastName email image")
            .populate("coInstructors", "firstName lastName email image")
            .populate("category")
            .exec();

        return res.status(200).json({
            success: true,
            message: "Successfully enrolled as co-instructor",
            data: updatedCourse
        });

    } catch (error) {
        console.error("Error enrolling as instructor:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to enroll as instructor",
            error: error.message
        });
    }
}