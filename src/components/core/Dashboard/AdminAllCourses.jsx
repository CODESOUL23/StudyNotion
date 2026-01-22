import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { getAllCoursesAdmin, deleteCourseAdmin } from "../../../services/operations/adminAPI"
import { FaTrash, FaEye, FaStar, FaUsers } from "react-icons/fa"
import { Link } from "react-router-dom"
import ConfirmationModal from "../../common/ConfirmationModal"

const AdminAllCourses = () => {
  const { token } = useSelector((state) => state.auth)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchCourses()
  }, [token])

  const fetchCourses = async () => {
    setLoading(true)
    const result = await getAllCoursesAdmin(token)
    setCourses(result || [])
    setLoading(false)
  }

  const handleDeleteCourse = async (courseId) => {
    const result = await deleteCourseAdmin(token, courseId)
    if (result) {
      setCourses(courses.filter((course) => course._id !== courseId))
    }
    setConfirmationModal(null)
  }

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
      month: "short",
      day: "numeric",
    })
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || course.status?.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const totalRevenue = filteredCourses.reduce((acc, course) => acc + (course.totalRevenue || 0), 0)
  const totalStudents = filteredCourses.reduce((acc, course) => acc + (course.totalStudents || 0), 0)

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
        All Courses
      </h1>

      {/* Stats */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="bg-purple-600 rounded-lg px-4 py-3">
          <p className="text-2xl font-bold">{filteredCourses.length}</p>
          <p className="text-xs text-white/80">Total Courses</p>
        </div>
        <div className="bg-blue-600 rounded-lg px-4 py-3">
          <p className="text-2xl font-bold">{totalStudents}</p>
          <p className="text-xs text-white/80">Total Students</p>
        </div>
        <div className="bg-green-600 rounded-lg px-4 py-3">
          <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-white/80">Total Revenue</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-3 rounded-lg bg-richblack-700 text-richblack-5 border border-richblack-600 focus:border-yellow-50 outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-lg bg-richblack-700 text-richblack-5 border border-richblack-600 focus:border-yellow-50 outline-none"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Courses Table */}
      {filteredCourses.length === 0 ? (
        <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-12 text-center">
          <p className="text-richblack-300 text-lg">No courses found</p>
        </div>
      ) : (
        <div className="rounded-xl border border-richblack-700 bg-richblack-800 overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-richblack-700">
              <tr className="text-richblack-300 text-sm text-left">
                <th className="p-4">Course</th>
                <th className="p-4">Instructor</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Students</th>
                <th className="p-4">Revenue</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr
                  key={course._id}
                  className="border-t border-richblack-700 hover:bg-richblack-700/50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={course.thumbnail}
                        alt={course.courseName}
                        className="w-16 h-10 object-cover rounded"
                      />
                      <div className="max-w-[200px]">
                        <p className="text-richblack-5 font-medium line-clamp-1">
                          {course.courseName}
                        </p>
                        <p className="text-richblack-400 text-xs">
                          {formatDate(course.createdAt)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          course.instructor?.image ||
                          `https://api.dicebear.com/5.x/initials/svg?seed=${course.instructor?.firstName}`
                        }
                        alt={course.instructor?.firstName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-richblack-300 text-sm">
                        {course.instructor?.firstName} {course.instructor?.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-richblack-300 text-sm">
                      {course.category?.name || "N/A"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-yellow-50 font-semibold">
                      ₹{course.price}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-caribbeangreen-200">
                      <FaUsers />
                      <span>{course.totalStudents}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-green-400 font-medium">
                      {formatCurrency(course.totalRevenue)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        course.status === "Published"
                          ? "bg-green-900/30 text-green-400"
                          : "bg-yellow-900/30 text-yellow-400"
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/courses/${course._id}`}
                        className="p-2 rounded-lg bg-richblack-600 hover:bg-richblack-500 text-richblack-300 hover:text-richblack-5 transition-colors"
                        title="View Course"
                      >
                        <FaEye />
                      </Link>
                      <button
                        onClick={() =>
                          setConfirmationModal({
                            text1: "Delete this Course?",
                            text2:
                              "This will permanently delete the course and all its content. This action cannot be undone.",
                            btn1Text: "Delete",
                            btn2Text: "Cancel",
                            btn1Handler: () => handleDeleteCourse(course._id),
                            btn2Handler: () => setConfirmationModal(null),
                          })
                        }
                        className="p-2 rounded-lg bg-pink-900/30 hover:bg-pink-800 text-pink-400 hover:text-white transition-colors"
                        title="Delete Course"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  )
}

export default AdminAllCourses
