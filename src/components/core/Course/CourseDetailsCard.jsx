import React from "react"
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { addToCart } from "../../../slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import { enrollAsInstructor } from "../../../services/operations/courseDetailsAPI"

// const CourseIncludes = [
//   "8 hours on-demand video",
//   "Full Lifetime access",
//   "Access on Mobile and TV",
//   "Certificate of completion",
// ]

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    thumbnail: ThumbnailImage,
    price: CurrentPrice,
    _id: courseId,
  } = course

  // Check if the current user is the instructor of this course
  const isInstructor = user && course?.instructor?._id === user?._id
  // Check if user is a co-instructor of this course
  const isCoInstructor = user && course?.coInstructors?.some(
    (coInstructor) => coInstructor?._id === user?._id || coInstructor === user?._id
  )
  // Check if user is an instructor account (but not this course's instructor)
  const isInstructorAccount = user?.accountType === ACCOUNT_TYPE.INSTRUCTOR
  // Check if user is enrolled in the course
  const isEnrolled = user && course?.studentsEnroled?.includes(user?._id)
  // Check if course has reached max co-instructors (2 total including main)
  const canEnrollAsInstructor = isInstructorAccount && !isInstructor && !isCoInstructor && 
    (course?.coInstructors?.length || 0) < 2

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link copied to clipboard")
  }

  const handleEnrollAsInstructor = async () => {
    if (!token) {
      setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to enroll as instructor",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      })
      return
    }
    await enrollAsInstructor(courseId, token, navigate)
  }

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    if (token) {
      dispatch(addToCart(course))
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  // console.log("Student already enrolled ", course?.studentsEnroled, user?._id)

  return (
    <>
      <div
        className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}
      >
        {/* Course Image */}
        <img
          src={ThumbnailImage}
          alt={course?.courseName}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        />

        <div className="px-4">
          {/* Show price only for non-instructors (not owner or co-instructor) */}
          {!isInstructor && !isCoInstructor && (
            <div className="space-x-3 pb-4 text-3xl font-semibold">
              Rs. {CurrentPrice}
            </div>
          )}
          
          <div className="flex flex-col gap-4">
            {/* Main Instructor of this course */}
            {isInstructor ? (
              <>
                <button
                  className="yellowButton"
                  onClick={() => navigate("/dashboard/my-courses")}
                >
                  Manage Course
                </button>
                <button
                  className="blackButton"
                  onClick={() => navigate(`/dashboard/edit-course/${courseId}`)}
                >
                  Edit Course
                </button>
              </>
            ) : isCoInstructor ? (
              /* Co-instructor of this course */
              <>
                <button
                  className="yellowButton"
                  onClick={() => navigate("/dashboard/my-courses")}
                >
                  View in My Courses
                </button>
                <button
                  className="blackButton"
                  onClick={() => navigate(`/dashboard/edit-course/${courseId}`)}
                >
                  Edit Course
                </button>
              </>
            ) : canEnrollAsInstructor ? (
              /* Instructor who can enroll as co-instructor */
              <button
                className="yellowButton"
                onClick={handleEnrollAsInstructor}
              >
                Enroll as Instructor
              </button>
            ) : isInstructorAccount && !canEnrollAsInstructor ? (
              /* Instructor but course has max co-instructors */
              <div className="text-center text-sm text-richblack-300 py-4">
                This course has reached the maximum number of instructors
              </div>
            ) : isEnrolled ? (
              /* Already enrolled student */
              <button
                className="yellowButton"
                onClick={() => navigate("/dashboard/enrolled-courses")}
              >
                Go To Course
              </button>
            ) : (
              /* Not enrolled - show buy options */
              <>
                <button className="yellowButton" onClick={handleBuyCourse}>
                  Buy Now
                </button>
                <button onClick={handleAddToCart} className="blackButton">
                  Add to Cart
                </button>
              </>
            )}
          </div>
          
          {/* Show money-back guarantee only for non-instructors who haven't enrolled */}
          {!isInstructor && !isEnrolled && (
            <div>
              <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
                30-Day Money-Back Guarantee
              </p>
            </div>
          )}

          <div className={``}>
            <p className={`my-2 text-xl font-semibold `}>
              This Course Includes :
            </p>
            <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
              {course?.instructions?.map((item, i) => {
                return (
                  <p className={`flex gap-2`} key={i}>
                    <BsFillCaretRightFill />
                    <span>{item}</span>
                  </p>
                )
              })}
            </div>
          </div>
          <div className="text-center">
            <button
              className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
              onClick={handleShare}
            >
              <FaShareSquare size={15} /> Share
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseDetailsCard
