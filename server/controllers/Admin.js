const User = require("../models/User");
const Course = require("../models/Course");
const Demo = require("../models/Demo");
const Category = require("../models/category");

// Get Admin Dashboard Stats
exports.getAdminDashboard = async (req, res) => {
    try {
        // Get counts
        const totalStudents = await User.countDocuments({ accountType: "Student" });
        const totalInstructors = await User.countDocuments({ accountType: "Instructor" });
        const totalCourses = await Course.countDocuments({ status: "Published" });
        const pendingVerifications = await User.countDocuments({ 
            accountType: "Instructor", 
            verificationStatus: "pending" 
        });
        
        // Get total demo enrollments
        const demoEnrollments = await Demo.countDocuments();
        
        // Get recent courses
        const recentCourses = await Course.find({ status: "Published" })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("instructor", "firstName lastName email image")
            .populate("category", "name");
        
        // Get total revenue (sum of all course enrollments * price)
        const courses = await Course.find({ status: "Published" })
            .select("price studentsEnrolled");
        
        let totalRevenue = 0;
        courses.forEach(course => {
            totalRevenue += (course.price * (course.studentsEnrolled?.length || 0));
        });

        return res.status(200).json({
            success: true,
            data: {
                totalStudents,
                totalInstructors,
                totalCourses,
                pendingVerifications,
                demoEnrollments,
                totalRevenue,
                recentCourses
            }
        });
    } catch (error) {
        console.error("Error in getAdminDashboard:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin dashboard",
            error: error.message
        });
    }
};

// Get All Instructors with their courses
exports.getAllInstructors = async (req, res) => {
    try {
        const instructors = await User.find({ accountType: "Instructor" })
            .select("firstName lastName email image isVerifiedInstructor verificationStatus createdAt")
            .sort({ createdAt: -1 });

        // For each instructor, find courses where they are instructor or co-instructor
        const instructorsWithStats = await Promise.all(instructors.map(async (instructor) => {
            const instructorObj = instructor.toObject();
            
            // Get courses where this user is the main instructor OR co-instructor
            const allCourses = await Course.find({
                $or: [
                    { instructor: instructor._id },
                    { coInstructors: instructor._id }
                ]
            })
                .select("courseName thumbnail price studentsEnrolled status instructor")
                .populate("category", "name");
            
            // Separate into owned (main instructor) and co-instructor courses
            const ownedCourses = allCourses.filter(c => c.instructor.toString() === instructor._id.toString());
            const coInstructorCourses = allCourses.filter(c => c.instructor.toString() !== instructor._id.toString());
            
            const totalStudents = ownedCourses.reduce((acc, course) => {
                return acc + (course.studentsEnrolled?.length || 0);
            }, 0);
            
            const totalRevenue = ownedCourses.reduce((acc, course) => {
                return acc + (course.price * (course.studentsEnrolled?.length || 0));
            }, 0);
            
            return {
                ...instructorObj,
                courses: ownedCourses,
                coInstructorCourses: coInstructorCourses,
                totalCourses: ownedCourses.length,
                totalCoInstructorCourses: coInstructorCourses.length,
                totalStudents,
                totalRevenue
            };
        }));

        return res.status(200).json({
            success: true,
            data: instructorsWithStats
        });
    } catch (error) {
        console.error("Error in getAllInstructors:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch instructors",
            error: error.message
        });
    }
};

// Get all enrolled students by course
exports.getEnrolledStudents = async (req, res) => {
    try {
        const courses = await Course.find({ status: "Published" })
            .select("courseName thumbnail price studentsEnrolled instructor category")
            .populate("instructor", "firstName lastName email")
            .populate("category", "name")
            .populate({
                path: "studentsEnrolled",
                select: "firstName lastName email image createdAt"
            })
            .sort({ "studentsEnrolled.length": -1 });

        // Filter courses that have enrolled students
        const coursesWithStudents = courses.filter(course => 
            course.studentsEnrolled && course.studentsEnrolled.length > 0
        );

        // Get total count
        const totalEnrollments = coursesWithStudents.reduce((acc, course) => 
            acc + course.studentsEnrolled.length, 0
        );

        return res.status(200).json({
            success: true,
            data: {
                courses: coursesWithStudents,
                totalEnrollments
            }
        });
    } catch (error) {
        console.error("Error in getEnrolledStudents:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch enrolled students",
            error: error.message
        });
    }
};

// Get all demo enrollments
exports.getDemoEnrollments = async (req, res) => {
    try {
        const demoEnrollments = await Demo.find()
            .populate("course", "courseName thumbnail instructor category")
            .populate({
                path: "course",
                populate: [
                    { path: "instructor", select: "firstName lastName email" },
                    { path: "category", select: "name" }
                ]
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: demoEnrollments
        });
    } catch (error) {
        console.error("Error in getDemoEnrollments:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch demo enrollments",
            error: error.message
        });
    }
};

// Get all courses (admin view)
exports.getAllCoursesAdmin = async (req, res) => {
    try {
        const courses = await Course.find()
            .select("courseName courseDescription thumbnail price status studentsEnrolled createdAt tag")
            .populate("instructor", "firstName lastName email image")
            .populate("category", "name")
            .populate("ratingAndReviews")
            .sort({ createdAt: -1 });

        // Add stats
        const coursesWithStats = courses.map(course => {
            const courseObj = course.toObject();
            return {
                ...courseObj,
                totalStudents: courseObj.studentsEnrolled?.length || 0,
                totalRevenue: courseObj.price * (courseObj.studentsEnrolled?.length || 0),
                avgRating: courseObj.ratingAndReviews?.length > 0 
                    ? courseObj.ratingAndReviews.reduce((acc, r) => acc + r.rating, 0) / courseObj.ratingAndReviews.length 
                    : 0
            };
        });

        return res.status(200).json({
            success: true,
            data: coursesWithStats
        });
    } catch (error) {
        console.error("Error in getAllCoursesAdmin:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses",
            error: error.message
        });
    }
};

// Delete course (admin)
exports.deleteCourseAdmin = async (req, res) => {
    try {
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required"
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Remove course from category
        await Category.findByIdAndUpdate(course.category, {
            $pull: { courses: courseId }
        });

        // Remove course from instructor's courses
        await User.findByIdAndUpdate(course.instructor, {
            $pull: { courses: courseId }
        });

        // Remove course from all enrolled students
        if (course.studentsEnrolled && course.studentsEnrolled.length > 0) {
            await User.updateMany(
                { _id: { $in: course.studentsEnrolled } },
                { $pull: { courses: courseId } }
            );
        }

        // Delete the course
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteCourseAdmin:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete course",
            error: error.message
        });
    }
};

// Get instructor profile details (admin view)
exports.getInstructorProfile = async (req, res) => {
    try {
        const { instructorId } = req.body;

        const instructor = await User.findById(instructorId)
            .select("-password")
            .populate("additionalDetails");

        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found"
            });
        }

        // Get courses where this user is the main instructor OR co-instructor
        const allCourses = await Course.find({
            $or: [
                { instructor: instructorId },
                { coInstructors: instructorId }
            ]
        })
            .populate("category", "name")
            .populate("studentsEnrolled", "firstName lastName email image")
            .populate("ratingAndReviews");
        
        // Separate into owned (main instructor) and co-instructor courses
        const ownedCourses = allCourses.filter(c => c.instructor.toString() === instructorId.toString());
        const coInstructorCourses = allCourses.filter(c => c.instructor.toString() !== instructorId.toString());

        // Calculate stats based on owned courses only
        const totalStudents = ownedCourses.reduce((acc, course) => 
            acc + (course.studentsEnrolled?.length || 0), 0
        );

        const totalRevenue = ownedCourses.reduce((acc, course) => 
            acc + (course.price * (course.studentsEnrolled?.length || 0)), 0
        );

        const allRatings = ownedCourses.flatMap(course => 
            course.ratingAndReviews || []
        );
        
        const avgRating = allRatings.length > 0 
            ? allRatings.reduce((acc, r) => acc + r.rating, 0) / allRatings.length 
            : 0;

        const instructorObj = instructor.toObject();
        instructorObj.courses = ownedCourses;
        instructorObj.coInstructorCourses = coInstructorCourses;

        return res.status(200).json({
            success: true,
            data: {
                instructor: instructorObj,
                stats: {
                    totalCourses: ownedCourses.length,
                    totalCoInstructorCourses: coInstructorCourses.length,
                    totalStudents,
                    totalRevenue,
                    avgRating: avgRating.toFixed(1),
                    totalReviews: allRatings.length
                }
            }
        });
    } catch (error) {
        console.error("Error in getInstructorProfile:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch instructor profile",
            error: error.message
        });
    }
};
