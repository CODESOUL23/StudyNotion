const BASE_URL = process.env.REACT_APP_BASE_URL

export const categories = {
    CATEGORIES_API: BASE_URL + "/courses/showAllCategories",
}

// AUTH ENDPOINTS
export const endpoints = {
    SENDOTP_API: BASE_URL + "/user/sendotp",
    SIGNUP_API: BASE_URL + "/user/signup",
    LOGIN_API: BASE_URL + "/user/login",
    RESETPASSTOKEN_API: BASE_URL + "/user/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/user/reset-password",
}

// CATALOG PAGE DATA
export const catalogData = {
    CATALOGPAGEDATA_API: BASE_URL + "/courses/categoryPageDetails",
}

// COURSE ENDPOINTS
export const courseEndpoints = {
    COURSE_DETAILS_API: BASE_URL + "/courses/getCourseDetails",
    COURSE_CATEGORIES_API: BASE_URL + "/courses/showAllCategories",
    GET_ALL_COURSE_API: BASE_URL + "/courses/getAllCourses",
    CREATE_COURSE_API: BASE_URL + "/courses/createCourse",
    EDIT_COURSE_API: BASE_URL + "/courses/editCourse",
    CREATE_SECTION_API: BASE_URL + "/courses/createSection",
    CREATE_SUBSECTION_API: BASE_URL + "/courses/createSubSection",
    UPDATE_SECTION_API: BASE_URL + "/courses/updateSection",
    UPDATE_SUBSECTION_API: BASE_URL + "/courses/updateSubSection",
    DELETE_SECTION_API: BASE_URL + "/courses/deleteSection",
    DELETE_SUBSECTION_API: BASE_URL + "/courses/deleteSubSection",
    GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/courses/getInstructorCourses",
    DELETE_COURSE_API: BASE_URL + "/courses/deleteCourse",
    GET_FULL_COURSE_DETAILS_AUTHENTICATED: BASE_URL + "/courses/getFullCourseDetails",
    CREATE_RATING_API: BASE_URL + "/courses/createRating",
    LECTURE_COMPLETION_API: BASE_URL + "/courses/updateCourseProgress",
    ENROLL_AS_INSTRUCTOR_API: BASE_URL + "/courses/enrollAsInstructor",
}

// STUDENT ENDPOINTS
export const studentEndpoints = {
    COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
    COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
    SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
}

// PROFILE ENDPOINTS
export const profileEndpoints = {
    GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
    GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
    GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
}

// SETTINGS PAGE API
export const settingsEndpoints = {
    UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
    UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
    CHANGE_PASSWORD_API: BASE_URL + "/user/changepassword",
    DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
}

// RATINGS ENDPOINTS
export const ratingsEndpoints = {
    REVIEWS_DETAILS_API: BASE_URL + "/courses/getAllRating",
}

// INSTRUCTOR VERIFICATION ENDPOINTS
export const verificationEndpoints = {
    REQUEST_VERIFICATION_API: BASE_URL + "/profile/requestInstructorVerification",
    GET_VERIFICATION_REQUESTS_API: BASE_URL + "/profile/getVerificationRequests",
    APPROVE_INSTRUCTOR_API: BASE_URL + "/profile/approveInstructor",
    REJECT_INSTRUCTOR_API: BASE_URL + "/profile/rejectInstructor",
}

// ADMIN ENDPOINTS
export const adminEndpoints = {
    ADMIN_DASHBOARD_API: BASE_URL + "/admin/dashboard",
    GET_ALL_INSTRUCTORS_API: BASE_URL + "/admin/instructors",
    GET_INSTRUCTOR_PROFILE_API: BASE_URL + "/admin/instructor-profile",
    GET_ENROLLED_STUDENTS_API: BASE_URL + "/admin/enrolled-students",
    GET_DEMO_ENROLLMENTS_API: BASE_URL + "/admin/demo-enrollments",
    GET_ALL_COURSES_ADMIN_API: BASE_URL + "/admin/courses",
    DELETE_COURSE_ADMIN_API: BASE_URL + "/admin/delete-course",
}