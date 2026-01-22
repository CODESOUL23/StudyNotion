import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { getEnrolledStudents } from "../../../services/operations/adminAPI"
import { FaUsers, FaChevronDown, FaChevronUp } from "react-icons/fa"

const AdminEnrolledStudents = () => {
  const { token } = useSelector((state) => state.auth)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedCourses, setExpandedCourses] = useState({})
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const result = await getEnrolledStudents(token)
      setData(result)
      setLoading(false)
    }
    fetchData()
  }, [token])

  const toggleCourse = (courseId) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredCourses = data?.courses?.filter(
    (course) =>
      course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.studentsEnrolled?.some(
        (student) =>
          student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
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
        Enrolled Students
      </h1>

      {/* Stats */}
      <div className="mb-6 flex items-center gap-4">
        <div className="bg-blue-600 rounded-lg px-4 py-3 flex items-center gap-3">
          <FaUsers className="text-2xl" />
          <div>
            <p className="text-2xl font-bold">{data?.totalEnrollments || 0}</p>
            <p className="text-xs text-white/80">Total Enrollments</p>
          </div>
        </div>
        <div className="bg-purple-600 rounded-lg px-4 py-3 flex items-center gap-3">
          <p className="text-2xl font-bold">{data?.courses?.length || 0}</p>
          <p className="text-xs text-white/80">Courses with Students</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by course, instructor, or student..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 px-4 py-3 rounded-lg bg-richblack-700 text-richblack-5 border border-richblack-600 focus:border-yellow-50 outline-none"
        />
      </div>

      {/* Courses List */}
      {filteredCourses?.length === 0 ? (
        <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-12 text-center">
          <p className="text-richblack-300 text-lg">No enrolled students found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses?.map((course) => (
            <div
              key={course._id}
              className="rounded-xl border border-richblack-700 bg-richblack-800 overflow-hidden"
            >
              {/* Course Header */}
              <div
                onClick={() => toggleCourse(course._id)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-richblack-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-16 h-12 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="text-richblack-5 font-semibold">
                      {course.courseName}
                    </h3>
                    <p className="text-richblack-400 text-sm">
                      by {course.instructor?.firstName} {course.instructor?.lastName} • {course.category?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-yellow-50 font-bold">
                      {course.studentsEnrolled?.length || 0} Students
                    </p>
                    <p className="text-richblack-400 text-sm">
                      ₹{course.price}
                    </p>
                  </div>
                  {expandedCourses[course._id] ? (
                    <FaChevronUp className="text-richblack-400" />
                  ) : (
                    <FaChevronDown className="text-richblack-400" />
                  )}
                </div>
              </div>

              {/* Students List */}
              {expandedCourses[course._id] && (
                <div className="border-t border-richblack-700 p-4 bg-richblack-900">
                  <table className="w-full">
                    <thead>
                      <tr className="text-richblack-400 text-sm text-left">
                        <th className="pb-3">Student</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.studentsEnrolled?.map((student) => (
                        <tr
                          key={student._id}
                          className="border-t border-richblack-700"
                        >
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  student.image ||
                                  `https://api.dicebear.com/5.x/initials/svg?seed=${student.firstName} ${student.lastName}`
                                }
                                alt={student.firstName}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <span className="text-richblack-5">
                                {student.firstName} {student.lastName}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 text-richblack-300">
                            {student.email}
                          </td>
                          <td className="py-3 text-richblack-400 text-sm">
                            {formatDate(student.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminEnrolledStudents
