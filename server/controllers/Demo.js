const Demo = require("../models/Demo");
const Course = require("../models/Course");
const mailSender = require("../utils/mailSender");
const { demoEnrollmentEmail } = require("../mail/templates/demoEnrollmentEmail");
const crypto = require("crypto");

// Generate unique access code
const generateAccessCode = () => {
    return crypto.randomBytes(4).toString("hex").toUpperCase();
};

// Book a demo class
exports.bookDemo = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, courseId, message } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        // Check if course exists
        const course = await Course.findById(courseId).populate("instructor", "firstName lastName");
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Check if user already has an active demo for this course
        const existingDemo = await Demo.findOne({
            email: email,
            course: courseId,
            status: "Active",
            expiryDate: { $gt: new Date() }
        });

        if (existingDemo) {
            return res.status(400).json({
                success: false,
                message: "You already have an active demo for this course. Please check your email for access details."
            });
        }

        // Calculate expiry date (3 days from now)
        const enrollmentDate = new Date();
        const expiryDate = new Date(enrollmentDate);
        expiryDate.setDate(expiryDate.getDate() + 3);

        // Generate unique access code
        const accessCode = generateAccessCode();

        // Create demo enrollment
        const demo = await Demo.create({
            firstName,
            lastName,
            email,
            phone,
            course: courseId,
            message: message || "",
            enrollmentDate,
            expiryDate,
            accessCode
        });

        // Format expiry date for email
        const formattedExpiryDate = expiryDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

        // Get instructor name
        const instructorName = course.instructor
            ? `${course.instructor.firstName} ${course.instructor.lastName}`
            : "Expert Instructor";

        // Send confirmation email
        await mailSender(
            email,
            `🎉 Welcome to Your Free Demo - ${course.courseName}`,
            demoEnrollmentEmail(
                firstName,
                course.courseName,
                course.courseDescription,
                instructorName,
                accessCode,
                formattedExpiryDate,
                course.whatYouWillLearn
            )
        );

        return res.status(200).json({
            success: true,
            message: "Demo booked successfully! Check your email for access details.",
            data: {
                demoId: demo._id,
                courseName: course.courseName,
                accessCode,
                expiryDate: formattedExpiryDate
            }
        });

    } catch (error) {
        console.error("Error booking demo:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to book demo. Please try again.",
            error: error.message
        });
    }
};

// Get all available demo courses
exports.getDemoCourses = async (req, res) => {
    try {
        // Get all published courses that are available for demo
        const courses = await Course.find({ status: "Published" })
            .populate("instructor", "firstName lastName image")
            .populate("category", "name")
            .select("courseName courseDescription thumbnail price instructor category ratingAndReviews whatYouWillLearn")
            .limit(12);

        return res.status(200).json({
            success: true,
            message: "Demo courses fetched successfully",
            data: courses
        });

    } catch (error) {
        console.error("Error fetching demo courses:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch demo courses",
            error: error.message
        });
    }
};

// Check demo status
exports.checkDemoStatus = async (req, res) => {
    try {
        const { email, accessCode } = req.body;

        if (!email || !accessCode) {
            return res.status(400).json({
                success: false,
                message: "Email and access code are required"
            });
        }

        const demo = await Demo.findOne({ email, accessCode }).populate("course", "courseName");

        if (!demo) {
            return res.status(404).json({
                success: false,
                message: "Demo enrollment not found"
            });
        }

        // Check if demo has expired
        if (new Date() > demo.expiryDate) {
            // Update status to expired if not already
            if (demo.status === "Active") {
                demo.status = "Expired";
                await demo.save();
            }
            return res.status(200).json({
                success: true,
                status: "Expired",
                message: "Your demo period has expired. Consider enrolling in the full course!"
            });
        }

        // Calculate remaining time
        const remainingTime = demo.expiryDate - new Date();
        const remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const remainingHours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        return res.status(200).json({
            success: true,
            status: demo.status,
            data: {
                courseName: demo.course.courseName,
                expiryDate: demo.expiryDate,
                remainingDays,
                remainingHours,
                message: `You have ${remainingDays} days and ${remainingHours} hours left in your demo.`
            }
        });

    } catch (error) {
        console.error("Error checking demo status:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to check demo status",
            error: error.message
        });
    }
};

// Get user's demo enrollments
exports.getUserDemos = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const demos = await Demo.find({ email })
            .populate("course", "courseName thumbnail instructor")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: demos
        });

    } catch (error) {
        console.error("Error fetching user demos:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch demo enrollments",
            error: error.message
        });
    }
};
