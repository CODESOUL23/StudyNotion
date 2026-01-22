const express = require("express")
const router = express.Router()
const { auth, isInstructor, isAdmin } = require("../middleware/auth")
const {
    deleteAccount,
    updateProfile,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,
    submitVerificationRequest,
    getPendingVerifications,
    approveInstructor,
    rejectInstructor,
} = require("../controllers/Profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

router.put("/updateProfile", auth, updateProfile)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.delete("/deleteAccount", auth, deleteAccount)
router.get("/getAllUserDetails", auth, getAllUserDetails)
router.get("/getEnrolledCourses", auth, getEnrolledCourses)

// ********************************************************************************************************
//                                      Instructor Verification routes
// ********************************************************************************************************

// Request instructor verification (Instructor only)
router.post("/requestInstructorVerification", auth, isInstructor, submitVerificationRequest)

// Get all pending verification requests (Admin only)
router.get("/getVerificationRequests", auth, isAdmin, getPendingVerifications)

// Approve instructor verification (Admin only)
router.post("/approveInstructor", auth, isAdmin, approveInstructor)

// Reject instructor verification (Admin only)
router.post("/rejectInstructor", auth, isAdmin, rejectInstructor)

module.exports = router;