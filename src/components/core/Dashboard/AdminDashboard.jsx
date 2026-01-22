import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { getAdminDashboard } from "../../../services/operations/adminAPI"
import { FaUsers, FaChalkboardTeacher, FaBookOpen, FaRupeeSign, FaClock, FaUserGraduate } from "react-icons/fa"
import { Link } from "react-router-dom"

const AdminDashboard = () => {
  const { token } = useSelector((state) => state.auth)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true)
      const result = await getAdminDashboard(token)
      setDashboardData(result)
      setLoading(false)
    }
    fetchDashboard()
  }, [token])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="spinner"></div>
      </div>
    )
  }

  const stats = [
    {
      title: "Total Students",
      value: dashboardData?.totalStudents || 0,
      icon: <FaUsers className="text-3xl" />,
      color: "bg-blue-600",
      link: "/dashboard/admin/enrolled-students"
    },
    {
      title: "Total Instructors",
      value: dashboardData?.totalInstructors || 0,
      icon: <FaChalkboardTeacher className="text-3xl" />,
      color: "bg-green-600",
      link: "/dashboard/admin/instructors"
    },
    {
      title: "Total Courses",
      value: dashboardData?.totalCourses || 0,
      icon: <FaBookOpen className="text-3xl" />,
      color: "bg-purple-600",
      link: "/dashboard/admin/courses"
    },
    {
      title: "Total Revenue",
      value: formatCurrency(dashboardData?.totalRevenue || 0),
      icon: <FaRupeeSign className="text-3xl" />,
      color: "bg-yellow-600",
      isRevenue: true
    },
    {
      title: "Pending Verifications",
      value: dashboardData?.pendingVerifications || 0,
      icon: <FaClock className="text-3xl" />,
      color: "bg-orange-600",
      link: "/dashboard/admin/verification-requests"
    },
    {
      title: "Demo Enrollments",
      value: dashboardData?.demoEnrollments || 0,
      icon: <FaUserGraduate className="text-3xl" />,
      color: "bg-pink-600",
      link: "/dashboard/admin/demo-students"
    },
  ]

  return (
    <div className="text-white">
      <h1 className="mb-8 text-3xl font-bold text-richblack-5">
        Admin Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link || "#"}
            className={`${stat.color} rounded-2xl p-6 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden group`}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-500"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-2 font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-white">
                  {stat.isRevenue ? stat.value : stat.value.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/20 p-4 rounded-2xl text-white backdrop-blur-sm">
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Courses */}
      <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-6 shadow-lg shadow-black/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-richblack-5">
            Recent Courses
          </h2>
          <Link
            to="/dashboard/admin/courses"
            className="text-yellow-50 text-sm hover:text-yellow-25 transition-colors font-medium"
          >
            View All →
          </Link>
        </div>

        {dashboardData?.recentCourses?.length === 0 ? (
          <p className="text-richblack-400 text-center py-8">No courses yet</p>
        ) : (
          <div className="space-y-3">
            {dashboardData?.recentCourses?.map((course) => (
              <div
                key={course._id}
                className="flex items-center gap-4 p-4 rounded-xl bg-richblack-700/50 hover:bg-richblack-700 transition-all duration-200 border border-transparent hover:border-richblack-600"
              >
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="w-16 h-12 object-cover rounded-lg shadow-md"
                />
                <div className="flex-1">
                  <h3 className="text-richblack-5 font-medium line-clamp-1">
                    {course.courseName}
                  </h3>
                  <p className="text-richblack-400 text-sm">
                    by {course.instructor?.firstName} {course.instructor?.lastName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-50 font-bold">
                    ₹{course.price}
                  </p>
                  <p className="text-richblack-400 text-xs">
                    {course.category?.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
