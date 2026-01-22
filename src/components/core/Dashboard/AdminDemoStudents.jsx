import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { getDemoEnrollments } from "../../../services/operations/adminAPI"
import { FaUserGraduate, FaPhone, FaEnvelope, FaCalendar } from "react-icons/fa"

const AdminDemoStudents = () => {
  const { token } = useSelector((state) => state.auth)
  const [demoEnrollments, setDemoEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const result = await getDemoEnrollments(token)
      setDemoEnrollments(result || [])
      setLoading(false)
    }
    fetchData()
  }, [token])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredEnrollments = demoEnrollments.filter(
    (enrollment) =>
      enrollment.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.course?.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
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
        Demo Enrollments
      </h1>

      {/* Stats */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-3 bg-pink-600 rounded-lg px-4 py-3">
          <FaUserGraduate className="text-2xl" />
          <div>
            <p className="text-2xl font-bold">{demoEnrollments.length}</p>
            <p className="text-xs text-white/80">Total Demo Requests</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 px-4 py-3 rounded-lg bg-richblack-700 text-richblack-5 border border-richblack-600 focus:border-yellow-50 outline-none"
        />
      </div>

      {/* Demo Enrollments List */}
      {filteredEnrollments.length === 0 ? (
        <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-12 text-center">
          <p className="text-richblack-300 text-lg">No demo enrollments found</p>
        </div>
      ) : (
        <div className="rounded-xl border border-richblack-700 bg-richblack-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-richblack-700">
              <tr className="text-richblack-300 text-sm text-left">
                <th className="p-4">Student</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Course</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrollments.map((enrollment) => (
                <tr
                  key={enrollment._id}
                  className="border-t border-richblack-700 hover:bg-richblack-700/50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {enrollment.firstName?.charAt(0)}
                        {enrollment.lastName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-richblack-5 font-medium">
                          {enrollment.firstName} {enrollment.lastName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-richblack-300 text-sm">
                        <FaEnvelope className="text-richblack-400" />
                        {enrollment.email}
                      </p>
                      <p className="flex items-center gap-2 text-richblack-300 text-sm">
                        <FaPhone className="text-richblack-400" />
                        {enrollment.countryCode} {enrollment.phone}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    {enrollment.course ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={enrollment.course.thumbnail}
                          alt={enrollment.course.courseName}
                          className="w-12 h-8 object-cover rounded"
                        />
                        <div>
                          <p className="text-richblack-5 text-sm line-clamp-1">
                            {enrollment.course.courseName}
                          </p>
                          <p className="text-richblack-400 text-xs">
                            {enrollment.course.instructor?.firstName}{" "}
                            {enrollment.course.instructor?.lastName}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-richblack-400">N/A</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-richblack-400 text-sm">
                      <FaCalendar />
                      {formatDate(enrollment.createdAt)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 rounded-lg bg-richblack-800 border border-richblack-700">
        <p className="text-richblack-300 text-sm">
          <strong className="text-richblack-5">Note:</strong> These are students who have requested a demo for courses. 
          You can contact them to convert them into paid enrollments.
        </p>
      </div>
    </div>
  )
}

export default AdminDemoStudents
