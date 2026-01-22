const express = require("express");
const router = express.Router();

const {
    getAdminDashboard,
    getAllInstructors,
    getEnrolledStudents,
    getDemoEnrollments,
    getAllCoursesAdmin,
    deleteCourseAdmin,
    getInstructorProfile,
} = require("../controllers/Admin");

const { auth, isAdmin } = require("../middleware/auth");

// ********************************************************************************************************
//                                      Admin routes
// ********************************************************************************************************

// Dashboard
router.get("/dashboard", auth, isAdmin, getAdminDashboard);

// Instructors
router.get("/instructors", auth, isAdmin, getAllInstructors);
router.post("/instructor-profile", auth, isAdmin, getInstructorProfile);

// Students/Enrollments
router.get("/enrolled-students", auth, isAdmin, getEnrolledStudents);
router.get("/demo-enrollments", auth, isAdmin, getDemoEnrollments);

// Courses
router.get("/courses", auth, isAdmin, getAllCoursesAdmin);
router.delete("/delete-course", auth, isAdmin, deleteCourseAdmin);

module.exports = router;
