const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
    login,
    signup,
    sendOTP,  // Fix: sendotp -> sendOTP
    changePassword,
} = require("../controllers/Auth")
const {
    resetPasswordToken,
    resetPassword,
} = require("../controllers/ResetPassword")
const {
    bookDemo,
    getDemoCourses,
    checkDemoStatus,
    getUserDemos,
} = require("../controllers/Demo")

const { auth } = require("../middleware/auth")

// Routes for Login, Signup, and Authentication
// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signup)

// Route for sending OTP to the user's email
router.post("/sendotp", sendOTP)  // Fix: Make sure handler name matches export

// Route for Changing the password
router.post("/changepassword", auth, changePassword)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

// ********************************************************************************************************
//                                      Demo Booking Routes
// ********************************************************************************************************

// Route for booking a demo class (no auth required)
router.post("/book-demo", bookDemo)

// Route for getting all available demo courses
router.get("/demo-courses", getDemoCourses)

// Route for checking demo status
router.post("/check-demo-status", checkDemoStatus)

// Route for getting user's demo enrollments
router.get("/user-demos", getUserDemos)

// Export the router for use in the main application
module.exports = router