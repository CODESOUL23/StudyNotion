import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getAllInstructors } from "../../../services/operations/adminAPI"
import { FaCheckCircle, FaClock, FaTimesCircle, FaEye, FaRupeeSign } from "react-icons/fa"

const AdminAllInstructors = () => {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchInstructors = async () => {
      setLoading(true)
      const result = await getAllInstructors(token)
      setInstructors(result || [])
      setLoading(false)
    }
    fetchInstructors()
  }, [token])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getVerificationBadge = (status, isVerified) => {
    if (isVerified || status === "approved") {
      return (
        <span className="flex items-center gap-1 text-green-400 text-xs">
          <FaCheckCircle /> Verified
        </span>
      )
    } else if (status === "pending") {
      return (
        <span className="flex items-center gap-1 text-yellow-400 text-xs">
          <FaClock /> Pending
        </span>
      )
    } else if (status === "rejected") {
      return (
        <span className="flex items-center gap-1 text-red-400 text-xs">
          <FaTimesCircle /> Rejected
        </span>
      )
    }
    return (
      <span className="flex items-center gap-1 text-richblack-400 text-xs">
        Not Verified
      </span>
    )
  }

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="text-white">
      <h1 className="mb-8 text-3xl font-medium text-richblack-5">
        All Instructors
      </h1>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search instructors by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 px-4 py-3 rounded-lg bg-richblack-700 text-richblack-5 border border-richblack-600 focus:border-yellow-50 outline-none"
        />
      </div>

      {/* Stats */}
      <div className="mb-6 text-richblack-300">
        Total: {filteredInstructors.length} instructor{filteredInstructors.length !== 1 ? "s" : ""}
      </div>

      {/* Instructors Grid */}
      {filteredInstructors.length === 0 ? (
        <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-12 text-center">
          <p className="text-richblack-300 text-lg">No instructors found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map((instructor) => (
            <div
              key={instructor._id}
              className="rounded-xl border border-richblack-700 bg-richblack-800 p-6 hover:border-richblack-500 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={
                    instructor.image ||
                    `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                  }
                  alt={`${instructor.firstName} ${instructor.lastName}`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-richblack-600"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-richblack-5">
                    {instructor.firstName} {instructor.lastName}
                  </h3>
                  <p className="text-richblack-400 text-sm truncate">
                    {instructor.email}
                  </p>
                  {getVerificationBadge(
                    instructor.verificationStatus,
                    instructor.isVerifiedInstructor
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4 py-4 border-t border-b border-richblack-700">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-50">
                    {instructor.totalCourses}
                    {instructor.totalCoInstructorCourses > 0 && (
                      <span className="text-sm text-blue-300"> +{instructor.totalCoInstructorCourses}</span>
                    )}
                  </p>
                  <p className="text-xs text-richblack-400">Courses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-caribbeangreen-200">
                    {instructor.totalStudents}
                  </p>
                  <p className="text-xs text-richblack-400">Students</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-pink-200">
                    {formatCurrency(instructor.totalRevenue)}
                  </p>
                  <p className="text-xs text-richblack-400">Revenue</p>
                </div>
              </div>

              {/* Courses Preview - Main Instructor */}
              {instructor.courses && instructor.courses.length > 0 && (
                <div className="mb-4">
                  <p className="text-richblack-300 text-sm mb-2">Courses:</p>
                  <div className="flex flex-wrap gap-1">
                    {instructor.courses.slice(0, 3).map((course) => (
                      <span
                        key={course._id}
                        className="text-xs bg-richblack-700 text-richblack-200 px-2 py-1 rounded"
                      >
                        {course.courseName?.substring(0, 20)}...
                      </span>
                    ))}
                    {instructor.courses.length > 3 && (
                      <span className="text-xs text-richblack-400">
                        +{instructor.courses.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Co-Instructor Courses Preview */}
              {instructor.coInstructorCourses && instructor.coInstructorCourses.length > 0 && (
                <div className="mb-4">
                  <p className="text-blue-300 text-sm mb-2">Co-Instructor in:</p>
                  <div className="flex flex-wrap gap-1">
                    {instructor.coInstructorCourses.slice(0, 3).map((course) => (
                      <span
                        key={course._id}
                        className="text-xs bg-blue-900/30 text-blue-200 px-2 py-1 rounded border border-blue-700"
                      >
                        {course.courseName?.substring(0, 20)}...
                      </span>
                    ))}
                    {instructor.coInstructorCourses.length > 3 && (
                      <span className="text-xs text-blue-400">
                        +{instructor.coInstructorCourses.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* View Profile Button */}
              <button
                onClick={() =>
                  navigate(`/dashboard/admin/instructor/${instructor._id}`)
                }
                className="w-full flex items-center justify-center gap-2 bg-richblack-700 hover:bg-richblack-600 text-richblack-5 py-2 rounded-lg font-medium transition-colors"
              >
                <FaEye />
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminAllInstructors
