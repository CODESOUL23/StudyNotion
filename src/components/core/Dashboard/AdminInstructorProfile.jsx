import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useParams, useNavigate, Link } from "react-router-dom"
import { getInstructorProfile } from "../../../services/operations/adminAPI"
import { FaArrowLeft, FaStar, FaUsers, FaRupeeSign, FaBookOpen, FaCheckCircle, FaClock, FaTimesCircle, FaEnvelope } from "react-icons/fa"

const AdminInstructorProfile = () => {
  const { instructorId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      const result = await getInstructorProfile(token, instructorId)
      setData(result)
      setLoading(false)
    }
    if (instructorId) {
      fetchProfile()
    }
  }, [token, instructorId])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getVerificationBadge = (status, isVerified) => {
    if (isVerified || status === "approved") {
      return (
        <span className="flex items-center gap-2 bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm">
          <FaCheckCircle /> Verified Instructor
        </span>
      )
    } else if (status === "pending") {
      return (
        <span className="flex items-center gap-2 bg-yellow-900/30 text-yellow-400 px-3 py-1 rounded-full text-sm">
          <FaClock /> Pending Verification
        </span>
      )
    } else if (status === "rejected") {
      return (
        <span className="flex items-center gap-2 bg-red-900/30 text-red-400 px-3 py-1 rounded-full text-sm">
          <FaTimesCircle /> Verification Rejected
        </span>
      )
    }
    return (
      <span className="flex items-center gap-2 bg-richblack-700 text-richblack-300 px-3 py-1 rounded-full text-sm">
        Not Verified
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-richblack-300 text-lg mb-4">Instructor not found</p>
        <button
          onClick={() => navigate(-1)}
          className="text-yellow-50 hover:underline"
        >
          Go Back
        </button>
      </div>
    )
  }

  const { instructor, stats } = data

  return (
    <div className="text-white">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-richblack-300 hover:text-richblack-5 mb-6 transition-colors"
      >
        <FaArrowLeft />
        Back to Instructors
      </button>

      {/* Profile Header */}
      <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <img
            src={
              instructor.image ||
              `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
            }
            alt={`${instructor.firstName} ${instructor.lastName}`}
            className="w-32 h-32 rounded-full object-cover border-4 border-richblack-600"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold text-richblack-5">
                {instructor.firstName} {instructor.lastName}
              </h1>
              {getVerificationBadge(
                instructor.verificationStatus,
                instructor.isVerifiedInstructor
              )}
            </div>
            <div className="flex items-center gap-2 text-richblack-300 mb-4">
              <FaEnvelope className="text-richblack-400" />
              {instructor.email}
            </div>
            <p className="text-richblack-400 text-sm">
              Joined on {formatDate(instructor.createdAt)}
            </p>
            {instructor.additionalDetails?.about && (
              <p className="mt-4 text-richblack-300">
                {instructor.additionalDetails.about}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-center">
          <FaBookOpen className="text-2xl mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.totalCourses}</p>
          <p className="text-xs text-white/80">Courses</p>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-green-600 to-green-700 p-4 text-center">
          <FaUsers className="text-2xl mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.totalStudents}</p>
          <p className="text-xs text-white/80">Students</p>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-700 p-4 text-center">
          <FaRupeeSign className="text-2xl mx-auto mb-2" />
          <p className="text-lg font-bold">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-xs text-white/80">Revenue</p>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 p-4 text-center">
          <FaStar className="text-2xl mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.avgRating}</p>
          <p className="text-xs text-white/80">Avg Rating</p>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-pink-600 to-pink-700 p-4 text-center">
          <p className="text-2xl font-bold">{stats.totalReviews}</p>
          <p className="text-xs text-white/80">Total Reviews</p>
        </div>
      </div>

      {/* Courses */}
      <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-6">
        <h2 className="text-xl font-semibold text-richblack-5 mb-6">
          Courses by {instructor.firstName}
        </h2>

        {instructor.courses?.length === 0 ? (
          <p className="text-richblack-400 text-center py-8">
            No courses created yet
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {instructor.courses?.map((course) => (
              <Link
                key={course._id}
                to={`/courses/${course._id}`}
                className="rounded-lg border border-richblack-600 bg-richblack-700 overflow-hidden hover:border-richblack-500 transition-colors"
              >
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-richblack-5 font-medium line-clamp-2 mb-2">
                    {course.courseName}
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-yellow-50 font-semibold">
                      ₹{course.price}
                    </span>
                    <span className="text-richblack-400">
                      {course.studentsEnrolled?.length || 0} students
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        course.status === "Published"
                          ? "bg-green-900/30 text-green-400"
                          : "bg-yellow-900/30 text-yellow-400"
                      }`}
                    >
                      {course.status}
                    </span>
                    {course.ratingAndReviews?.length > 0 && (
                      <span className="flex items-center gap-1 text-yellow-50 text-xs">
                        <FaStar />
                        {(
                          course.ratingAndReviews.reduce((a, r) => a + r.rating, 0) /
                          course.ratingAndReviews.length
                        ).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminInstructorProfile
