import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { adminEndpoints } from "../apis"

const {
  ADMIN_DASHBOARD_API,
  GET_ALL_INSTRUCTORS_API,
  GET_INSTRUCTOR_PROFILE_API,
  GET_ENROLLED_STUDENTS_API,
  GET_DEMO_ENROLLMENTS_API,
  GET_ALL_COURSES_ADMIN_API,
  DELETE_COURSE_ADMIN_API,
} = adminEndpoints

// Get Admin Dashboard Data
export async function getAdminDashboard(token) {
  const toastId = toast.loading("Loading dashboard...")
  let result = null
  try {
    const response = await apiConnector("GET", ADMIN_DASHBOARD_API, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("ADMIN_DASHBOARD_API RESPONSE:", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
  } catch (error) {
    console.log("ADMIN_DASHBOARD_API ERROR:", error)
    toast.error("Failed to load dashboard")
  }
  toast.dismiss(toastId)
  return result
}

// Get All Instructors
export async function getAllInstructors(token) {
  const toastId = toast.loading("Loading instructors...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_ALL_INSTRUCTORS_API, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("GET_ALL_INSTRUCTORS_API RESPONSE:", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
  } catch (error) {
    console.log("GET_ALL_INSTRUCTORS_API ERROR:", error)
    toast.error("Failed to load instructors")
  }
  toast.dismiss(toastId)
  return result
}

// Get Instructor Profile Details
export async function getInstructorProfile(token, instructorId) {
  const toastId = toast.loading("Loading instructor profile...")
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      GET_INSTRUCTOR_PROFILE_API,
      { instructorId },
      { Authorization: `Bearer ${token}` }
    )
    console.log("GET_INSTRUCTOR_PROFILE_API RESPONSE:", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
  } catch (error) {
    console.log("GET_INSTRUCTOR_PROFILE_API ERROR:", error)
    toast.error("Failed to load instructor profile")
  }
  toast.dismiss(toastId)
  return result
}

// Get Enrolled Students
export async function getEnrolledStudents(token) {
  const toastId = toast.loading("Loading enrolled students...")
  let result = null
  try {
    const response = await apiConnector("GET", GET_ENROLLED_STUDENTS_API, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("GET_ENROLLED_STUDENTS_API RESPONSE:", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
  } catch (error) {
    console.log("GET_ENROLLED_STUDENTS_API ERROR:", error)
    toast.error("Failed to load enrolled students")
  }
  toast.dismiss(toastId)
  return result
}

// Get Demo Enrollments
export async function getDemoEnrollments(token) {
  const toastId = toast.loading("Loading demo enrollments...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_DEMO_ENROLLMENTS_API, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("GET_DEMO_ENROLLMENTS_API RESPONSE:", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
  } catch (error) {
    console.log("GET_DEMO_ENROLLMENTS_API ERROR:", error)
    toast.error("Failed to load demo enrollments")
  }
  toast.dismiss(toastId)
  return result
}

// Get All Courses (Admin)
export async function getAllCoursesAdmin(token) {
  const toastId = toast.loading("Loading courses...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_ALL_COURSES_ADMIN_API, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("GET_ALL_COURSES_ADMIN_API RESPONSE:", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
  } catch (error) {
    console.log("GET_ALL_COURSES_ADMIN_API ERROR:", error)
    toast.error("Failed to load courses")
  }
  toast.dismiss(toastId)
  return result
}

// Delete Course (Admin)
export async function deleteCourseAdmin(token, courseId) {
  const toastId = toast.loading("Deleting course...")
  let result = false
  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_COURSE_ADMIN_API,
      { courseId },
      { Authorization: `Bearer ${token}` }
    )
    console.log("DELETE_COURSE_ADMIN_API RESPONSE:", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Course deleted successfully")
    result = true
  } catch (error) {
    console.log("DELETE_COURSE_ADMIN_API ERROR:", error)
    toast.error("Failed to delete course")
  }
  toast.dismiss(toastId)
  return result
}
