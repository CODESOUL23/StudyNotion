import { toast } from "react-hot-toast"
import { setLoading, setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { profileEndpoints, verificationEndpoints } from "../apis"
import { logout } from "./authAPI"

const { GET_USER_DETAILS_API, GET_USER_ENROLLED_COURSES_API, GET_INSTRUCTOR_DATA_API } =
  profileEndpoints

const {
  REQUEST_VERIFICATION_API,
  GET_VERIFICATION_REQUESTS_API,
  APPROVE_INSTRUCTOR_API,
  REJECT_INSTRUCTOR_API,
} = verificationEndpoints

export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("GET_USER_DETAILS API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      const userImage = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
      dispatch(setUser({ ...response.data.data, image: userImage }))
    } catch (error) {
      dispatch(logout(navigate))
      console.log("GET_USER_DETAILS API ERROR............", error)
      toast.error("Could Not Get User Details")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log(
      "GET_USER_ENROLLED_COURSES_API API RESPONSE............",
      response
    )

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
  } catch (error) {
    console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
    toast.error("Could Not Get Enrolled Courses")
  }
  toast.dismiss(toastId)
  return result
}

export async function getInstructorData(token) {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("GET_INSTRUCTOR_DATA_API API RESPONSE............", response)
    result = response?.data?.courses
  } catch (error) {
    console.log("GET_INSTRUCTOR_DATA_API API ERROR............", error)
    toast.error("Could Not Get Instructor Data")
  }
  toast.dismiss(toastId)
  return result
}

// ================ INSTRUCTOR VERIFICATION FUNCTIONS ================

// Request instructor verification
export async function requestInstructorVerification(token, documents) {
  const toastId = toast.loading("Submitting verification request...")
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      REQUEST_VERIFICATION_API,
      { documents },
      { Authorization: `Bearer ${token}` }
    )
    console.log("REQUEST_VERIFICATION_API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Verification request submitted successfully!")
    result = response.data
  } catch (error) {
    console.log("REQUEST_VERIFICATION_API ERROR............", error)
    toast.error(error.response?.data?.message || "Failed to submit verification request")
  }
  toast.dismiss(toastId)
  return result
}

// Get all verification requests (Admin only)
export async function getVerificationRequests(token) {
  const toastId = toast.loading("Loading verification requests...")
  let result = []
  try {
    const response = await apiConnector(
      "GET",
      GET_VERIFICATION_REQUESTS_API,
      null,
      { Authorization: `Bearer ${token}` }
    )
    console.log("GET_VERIFICATION_REQUESTS_API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
  } catch (error) {
    console.log("GET_VERIFICATION_REQUESTS_API ERROR............", error)
    toast.error("Failed to load verification requests")
  }
  toast.dismiss(toastId)
  return result
}

// Approve instructor (Admin only)
export async function approveInstructor(token, instructorId) {
  const toastId = toast.loading("Approving instructor...")
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      APPROVE_INSTRUCTOR_API,
      { instructorId },
      { Authorization: `Bearer ${token}` }
    )
    console.log("APPROVE_INSTRUCTOR_API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Instructor approved successfully!")
    result = response.data
  } catch (error) {
    console.log("APPROVE_INSTRUCTOR_API ERROR............", error)
    toast.error("Failed to approve instructor")
  }
  toast.dismiss(toastId)
  return result
}

// Reject instructor (Admin only)
export async function rejectInstructor(token, instructorId, reason) {
  const toastId = toast.loading("Rejecting instructor...")
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      REJECT_INSTRUCTOR_API,
      { instructorId, reason },
      { Authorization: `Bearer ${token}` }
    )
    console.log("REJECT_INSTRUCTOR_API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Instructor rejected")
    result = response.data
  } catch (error) {
    console.log("REJECT_INSTRUCTOR_API ERROR............", error)
    toast.error("Failed to reject instructor")
  }
  toast.dismiss(toastId)
  return result
}