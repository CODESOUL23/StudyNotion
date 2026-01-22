import React, { useEffect, useState } from "react"
import { FiClock, FiBarChart2, FiShoppingCart, FiUsers, FiTrash2 } from "react-icons/fi"
import { HiOutlineAcademicCap } from "react-icons/hi"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

import GetAvgRating from "../../../utils/avgRating"
import RatingStars from "../../common/RatingStars"
import { addToCart } from "../../../slices/cartSlice"
import { enrollAsInstructor, deleteCourse } from "../../../services/operations/courseDetailsAPI"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import ConfirmationModal from "../../common/ConfirmationModal"

function Course_Card({ course, Height, onCourseDelete }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { cart } = useSelector((state) => state.cart)
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Check if user is Admin
  const isAdmin = user?.accountType === ACCOUNT_TYPE.ADMIN

  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews)
    setAvgReviewCount(count)
  }, [course])

  // Check if user is the main instructor of this course
  const isMainInstructor = user && course?.instructor?._id === user?._id
  // Check if user is a co-instructor of this course
  const isCoInstructor = user && course?.coInstructors?.some(
    (coInstructor) => coInstructor?._id === user?._id || coInstructor === user?._id
  )
  // Check if user is any kind of instructor for this course
  const isCourseInstructor = isMainInstructor || isCoInstructor
  // Check if user has an instructor account
  const isInstructorAccount = user?.accountType === ACCOUNT_TYPE.INSTRUCTOR
  // Check if course can accept more co-instructors (max 2)
  const canEnrollAsInstructor = isInstructorAccount && !isCourseInstructor && 
    (course?.coInstructors?.length || 0) < 2

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (user && user?.accountType === "Instructor") {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    
    const isAlreadyInCart = cart.some((item) => item._id === course._id)
    if (isAlreadyInCart) {
      toast.error("Course is already in cart")
      return
    }
    
    dispatch(addToCart(course))
  }

  const handleEnrollAsInstructor = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!token) {
      toast.error("Please login to enroll as instructor")
      navigate("/login")
      return
    }
    
    setIsEnrolling(true)
    await enrollAsInstructor(course._id, token, navigate)
    setIsEnrolling(false)
  }

  const handleDeleteCourse = async () => {
    setIsDeleting(true)
    const result = await deleteCourse({ courseId: course._id }, token)
    if (result) {
      toast.success("Course deleted successfully")
      if (onCourseDelete) {
        onCourseDelete(course._id)
      }
    }
    setIsDeleting(false)
    setConfirmationModal(null)
  }

  // Format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Link to={`/courses/${course._id}`}>
      <div className="group relative rounded-xl border border-richblack-700 bg-richblack-800 overflow-hidden hover:shadow-2xl hover:shadow-yellow-50/10 transition-all duration-300 hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="relative overflow-hidden">
          <img
            src={course?.thumbnail}
            alt={course?.courseName}
            className={`${Height} w-full object-cover transition-transform duration-300 group-hover:scale-110`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-richblack-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full bg-richblack-800/90 backdrop-blur-sm text-xs font-semibold text-yellow-50 border border-yellow-50/20">
              {course?.category?.name || "Course"}
            </span>
          </div>
        </div>

        {/* Course Info */}
        <div className="p-5 space-y-3">
          {/* Title */}
          <h3 className="text-lg font-semibold text-richblack-5 line-clamp-2 min-h-[56px] group-hover:text-yellow-50 transition-colors">
            {course?.courseName}
          </h3>

          {/* Instructor */}
          <div className="flex items-center gap-2 text-sm text-richblack-300">
            <FiUsers className="text-yellow-50" />
            <p>
              {course?.instructor?.firstName} {course?.instructor?.lastName}
            </p>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between text-xs text-richblack-400">
            <div className="flex items-center gap-1">
              <FiBarChart2 className="text-caribbeangreen-200" />
              <span>
                {course?.courseContent?.length || 0} Sections
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FiClock className="text-pink-200" />
              <span>
                {course?.courseContent?.reduce((acc, section) => acc + (section?.subSection?.length || 0), 0) || 0} Lectures
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 py-2 border-t border-richblack-700">
            <span className="text-base font-semibold text-yellow-50">
              {avgReviewCount.toFixed(1)}
            </span>
            <RatingStars Review_Count={avgReviewCount} Star_Size={16} />
            <span className="text-xs text-richblack-400">
              ({course?.ratingAndReviews?.length || 0})
            </span>
          </div>

          {/* Price & Action Button */}
          <div className="flex items-center justify-between pt-3 border-t border-richblack-700">
            <div>
              <p className="text-2xl font-bold text-richblack-5">
                {formatPrice(course?.price)}
              </p>
            </div>
            {isCourseInstructor ? (
              /* User is instructor/co-instructor of this course */
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  navigate(`/dashboard/edit-course/${course._id}`)
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-richblack-700 hover:bg-richblack-600 text-richblack-5 font-medium transition-all duration-200 text-xs"
              >
                Edit Course
              </button>
            ) : canEnrollAsInstructor ? (
              /* Instructor who can enroll as co-instructor */
              <button
                onClick={handleEnrollAsInstructor}
                disabled={isEnrolling}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-caribbeangreen-200 hover:bg-caribbeangreen-300 text-richblack-900 font-medium transition-all duration-200 text-xs disabled:opacity-50"
              >
                <HiOutlineAcademicCap className="text-sm" />
                {isEnrolling ? "Enrolling..." : "Enroll as Instructor"}
              </button>
            ) : isInstructorAccount ? (
              /* Instructor but course has max co-instructors */
              <span className="text-xs text-richblack-400">Max instructors</span>
            ) : isAdmin ? (
              /* Admin - show Delete Course button */
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setConfirmationModal({
                    text1: "Delete this Course?",
                    text2: "This will permanently delete the course and all its content. This action cannot be undone.",
                    btn1Text: isDeleting ? "Deleting..." : "Delete",
                    btn2Text: "Cancel",
                    btn1Handler: handleDeleteCourse,
                    btn2Handler: () => setConfirmationModal(null),
                  })
                }}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white font-medium transition-all duration-200 text-xs disabled:opacity-50"
              >
                <FiTrash2 />
                Delete
              </button>
            ) : (
              /* Regular student - show Add to Cart */
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-richblack-900 font-medium transition-all duration-200 text-xs"
              >
                <FiShoppingCart />
                Add to Cart
              </button>
            )}
          </div>

          {/* What you'll learn preview */}
          {course?.whatYouWillLearn && (
            <div className="pt-3 border-t border-richblack-700">
              <p className="text-xs text-richblack-300 line-clamp-2">
                {course.whatYouWillLearn}
              </p>
            </div>
          )}
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </Link>
  )
}

export default Course_Card
