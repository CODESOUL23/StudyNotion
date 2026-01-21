const express = require("express")
const router = express.Router()
const { auth } = require("../middleware/auth")
const {
    deleteAccount,
    updateProfile,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,
} = require("../controllers/Profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

router.put("/updateProfile", auth, updateProfile)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.delete("/deleteAccount", auth, deleteAccount)
router.get("/getAllUserDetails", auth, getAllUserDetails)
router.get("/getEnrolledCourses", auth, getEnrolledCourses)

module.exports = router;