const express = require("express")
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const {
    createCourse,
    showAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    getInstructorCourses,
    editCourse,
    enrollAsInstructor,
} = require("../controllers/Course")


// Categories Controllers Import
const {
    showAllCategories,
    createCategory,
    categoryPageDetails,
} = require("../controllers/Category")

// Sections Controllers Import
const {
    createSection,
    updateSection,
    deleteSection,
} = require("../controllers/Section")

// Sub-Sections Controllers Import
const {
    createSubsection,
    updateSubsection,
    deleteSubsection,
} = require("../controllers/Subsection")

// Rating Controllers Import
const {
    createRating,
    getAverageRating,
    getAllRating,
} = require("../controllers/RatingAndReview")

// Course Progress Controllers Import
const {
    updateCourseProgress,
    getCourseProgress,
} = require("../controllers/CourseProgress")

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin, isVerifiedInstructor } = require("../middleware/auth")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

router.post("/createCourse" , auth , isInstructor , isVerifiedInstructor, createCourse);
router.post("/editCourse" , auth , isInstructor , (req, res, next) => {
    console.log("=== EDIT COURSE ROUTE HIT ===");
    console.log("Body:", req.body);
    console.log("Files:", req.files ? Object.keys(req.files) : "none");
    next();
}, editCourse);
router.get("/showAllCourses" , showAllCourses);
router.post("/getCourseDetails" , getCourseDetails);
router.post("/getFullCourseDetails" , auth , getFullCourseDetails);
router.get("/getInstructorCourses" , auth , isInstructor , getInstructorCourses);
router.post("/enrollAsInstructor" , auth , isInstructor , enrollAsInstructor);

//Section Routes
router.post("/createSection" , auth , isInstructor , createSection);
router.post("/updateSection" , auth , isInstructor , updateSection);
router.delete("/deleteSection" , auth , isInstructor , deleteSection);

//Subsection Routes
router.post("/createSubSection" , auth , isInstructor , createSubsection);
router.post("/updateSubSection" , auth , isInstructor , updateSubsection);
router.post("/deleteSubSection" , auth , isInstructor , deleteSubsection);

//**********************************************************************************************************
//                                     Category routes(Only Admin is authenticated to create a category)
//**********************************************************************************************************

router.post("/createCategory" , auth , isAdmin , createCategory);
router.get("/showAllCategories" , showAllCategories);
router.get("/categoryPageDetails" , categoryPageDetails);

//**********************************************************************************************************
//                                     Rating and Review routes
//**********************************************************************************************************

router.post("/createRating" , auth , isStudent , createRating);
router.get("/getAverageRating" , getAverageRating);
router.get("/getAllRating" , getAllRating);

//**********************************************************************************************************
//                                     Course Progress routes
//**********************************************************************************************************

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);
router.post("/getCourseProgress", auth, getCourseProgress);

module.exports = router;
