const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const crypto = require("crypto");

// ================ CAPTURE PAYMENT ================
// Initiate the Razorpay order for multiple courses
exports.capturePayment = async (req, res) => {
    console.log("========== CAPTURE PAYMENT CALLED ==========");
    console.log("Request body:", req.body);
    console.log("User from token:", req.user);
    
    const { courses } = req.body;
    const userId = req.user.id;

    // Validation
    if (!courses || courses.length === 0) {
        console.log("No courses provided");
        return res.status(400).json({
            success: false,
            message: "Please provide Course ID(s)"
        });
    }

    console.log("Courses to purchase:", courses);
    let total_amount = 0;

    for (const course_id of courses) {
        let course;
        try {
            // Find the course by ID
            course = await Course.findById(course_id);

            // If course not found
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Could not find the Course"
                });
            }

            // Check if user already enrolled
            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(400).json({
                    success: false,
                    message: "Student is already Enrolled in this course"
                });
            }

            // Add course price to total
            total_amount += course.price;
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Create Razorpay Order
    const options = {
        amount: total_amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        notes: {
            userId: userId,
            courses: JSON.stringify(courses)
        }
    };

    try {
        // Initiate the payment using Razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log("Razorpay Order Created:", paymentResponse);

        return res.status(200).json({
            success: true,
            message: "Order created successfully",
            data: paymentResponse
        });
    } catch (error) {
        console.log("Error creating Razorpay order:", error);
        return res.status(500).json({
            success: false,
            message: "Could not initiate order. Please try again."
        });
    }
};

// ================ VERIFY PAYMENT ================
// Verify the payment signature from Razorpay
exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses } = req.body;
    const userId = req.user.id;

    // Validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
        return res.status(400).json({
            success: false,
            message: "Payment verification failed - Missing parameters"
        });
    }

    // Create signature for verification
    let body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    // Compare signatures
    if (expectedSignature === razorpay_signature) {
        // Payment is verified - Enroll the student
        try {
            await enrollStudents(courses, userId, res);
        } catch (error) {
            console.log("Error enrolling student:", error);
            return res.status(500).json({
                success: false,
                message: "Error enrolling student in courses"
            });
        }
    } else {
        return res.status(400).json({
            success: false,
            message: "Payment signature verification failed"
        });
    }
};

// ================ ENROLL STUDENTS ================
// Helper function to enroll student in courses
const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
        return res.status(400).json({
            success: false,
            message: "Please provide Course ID and User ID"
        });
    }

    // Convert userId to ObjectId for consistent storage
    const userObjectId = new mongoose.Types.ObjectId(userId);

    for (const courseId of courses) {
        try {
            // Find the course and enroll the student
            const enrolledCourse = await Course.findByIdAndUpdate(
                courseId,
                {
                    $push: { studentsEnrolled: userObjectId }
                },
                { new: true }
            );

            if (!enrolledCourse) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found"
                });
            }

            console.log("Updated course:", enrolledCourse);

            // Create CourseProgress for the student
            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: []
            });

            // Find the student and add the course to their enrolled courses
            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        courses: courseId,
                        courseProgress: courseProgress._id
                    }
                },
                { new: true }
            );

            console.log("Enrolled student:", enrolledStudent);

            // Send course enrollment confirmation email
            try {
                const emailResponse = await mailSender(
                    enrolledStudent.email,
                    `Successfully Enrolled into ${enrolledCourse.courseName}`,
                    `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #FFD60A; text-align: center;">🎉 Congratulations!</h2>
                        <p>Dear ${enrolledStudent.firstName} ${enrolledStudent.lastName},</p>
                        <p>You have successfully enrolled in <strong>${enrolledCourse.courseName}</strong>.</p>
                        <div style="background: #1A1A1A; padding: 20px; border-radius: 10px; margin: 20px 0;">
                            <h3 style="color: #FFD60A; margin-top: 0;">Course Details:</h3>
                            <p><strong>Course:</strong> ${enrolledCourse.courseName}</p>
                            <p><strong>Price:</strong> ₹${enrolledCourse.price}</p>
                        </div>
                        <p>Start learning now and achieve your goals!</p>
                        <p style="text-align: center;">
                            <a href="http://localhost:3000/dashboard/enrolled-courses" 
                               style="background: #FFD60A; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                               Start Learning
                            </a>
                        </p>
                        <p style="margin-top: 30px;">Best regards,<br><strong>Team StudyNotion</strong></p>
                    </div>`
                );
                console.log("Email sent successfully:", emailResponse);
            } catch (emailError) {
                console.log("Error sending email:", emailError);
                // Don't fail the enrollment if email fails
            }
        } catch (error) {
            console.log("Error enrolling student in course:", error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    return res.status(200).json({
        success: true,
        message: "Payment verified and courses enrolled successfully"
    });
};

// ================ SEND PAYMENT SUCCESS EMAIL ================
exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;
    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields"
        });
    }

    try {
        const enrolledStudent = await User.findById(userId);

        await mailSender(
            enrolledStudent.email,
            `Payment Received - StudyNotion`,
            `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #22C55E; text-align: center;">✅ Payment Successful!</h2>
                <p>Dear ${enrolledStudent.firstName} ${enrolledStudent.lastName},</p>
                <p>We have received your payment of <strong>₹${amount / 100}</strong>.</p>
                <div style="background: #1A1A1A; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: #FFD60A; margin-top: 0;">Transaction Details:</h3>
                    <p><strong>Order ID:</strong> ${orderId}</p>
                    <p><strong>Payment ID:</strong> ${paymentId}</p>
                    <p><strong>Amount:</strong> ₹${amount / 100}</p>
                </div>
                <p>Your courses have been added to your account.</p>
                <p style="margin-top: 30px;">Best regards,<br><strong>Team StudyNotion</strong></p>
            </div>`
        );

        return res.status(200).json({
            success: true,
            message: "Payment success email sent"
        });
    } catch (error) {
        console.log("Error sending payment success email:", error);
        return res.status(500).json({
            success: false,
            message: "Could not send email"
        });
    }
};

// ================ WEBHOOK HANDLER (For server-to-server verification) ================
exports.webhookHandler = async (req, res) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "studynotion_webhook_secret";

    const signature = req.headers["x-razorpay-signature"];

    // Verify webhook signature
    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (signature === digest) {
        console.log("Webhook verified successfully");

        const event = req.body.event;
        const payload = req.body.payload;

        // Handle different webhook events
        switch (event) {
            case "payment.captured":
                console.log("Payment captured:", payload.payment.entity);
                // Payment was successful - you can add additional logic here
                break;
            case "payment.failed":
                console.log("Payment failed:", payload.payment.entity);
                // Handle failed payment
                break;
            case "order.paid":
                console.log("Order paid:", payload.order.entity);
                // Order was paid
                break;
            default:
                console.log("Unhandled webhook event:", event);
        }

        return res.status(200).json({ status: "ok" });
    } else {
        console.log("Webhook signature verification failed");
        return res.status(400).json({ status: "error" });
    }
};

