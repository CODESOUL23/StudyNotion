import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import RenderSteps from "./RenderSteps"
import { FaExclamationTriangle, FaClock, FaCheckCircle } from "react-icons/fa"

export default function AddCourse() {
  const { user } = useSelector((state) => state.profile)
  
  // Check if instructor is verified
  const isVerified = user?.isVerifiedInstructor === true
  const verificationStatus = user?.instructorVerificationStatus || "none"

  // If not verified, show verification required message
  if (!isVerified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="max-w-lg">
          {verificationStatus === "pending" ? (
            <>
              <FaClock className="text-yellow-400 text-6xl mx-auto mb-6" />
              <h1 className="text-3xl font-semibold text-richblack-5 mb-4">
                Verification Pending
              </h1>
              <p className="text-richblack-300 mb-6">
                Your instructor verification request is currently being reviewed by our team. 
                This usually takes 1-2 business days. You'll be notified via email once your 
                request has been processed.
              </p>
            </>
          ) : verificationStatus === "rejected" ? (
            <>
              <FaExclamationTriangle className="text-red-400 text-6xl mx-auto mb-6" />
              <h1 className="text-3xl font-semibold text-richblack-5 mb-4">
                Verification Rejected
              </h1>
              <p className="text-richblack-300 mb-6">
                Unfortunately, your verification request was not approved. Please review the 
                feedback and submit a new request with updated information.
              </p>
            </>
          ) : (
            <>
              <FaExclamationTriangle className="text-yellow-400 text-6xl mx-auto mb-6" />
              <h1 className="text-3xl font-semibold text-richblack-5 mb-4">
                Verification Required
              </h1>
              <p className="text-richblack-300 mb-6">
                To create courses on StudyNotion, you need to be a verified instructor. 
                This helps us ensure the quality of content on our platform and build 
                trust with our students.
              </p>
            </>
          )}
          
          <Link to="/dashboard/verification">
            <button className="bg-yellow-50 text-richblack-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-100 transition-all duration-200">
              {verificationStatus === "pending" 
                ? "View Verification Status" 
                : verificationStatus === "rejected"
                  ? "Resubmit Verification"
                  : "Get Verified Now"
              }
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex w-full items-start gap-x-6">
        <div className="flex flex-1 flex-col">
          <h1 className="mb-14 text-3xl font-medium text-richblack-5">
            Add Course
          </h1>
          <div className="flex-1">
            <RenderSteps />
          </div>
        </div>
        {/* Course Upload Tips */}
        <div className="sticky top-10 hidden max-w-[400px] flex-1 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 xl:block">
          <p className="mb-8 text-lg text-richblack-5">⚡ Course Upload Tips</p>
          <ul className="ml-5 list-item list-disc space-y-4 text-xs text-richblack-5">
            <li>Set the Course Price option or make it free.</li>
            <li>Standard size for the course thumbnail is 1024x576.</li>
            <li>Video section controls the course overview video.</li>
            <li>Course Builder is where you create & organize a course.</li>
            <li>
              Add Topics in the Course Builder section to create lessons,
              quizzes, and assignments.
            </li>
            <li>
              Information from the Additional Data section shows up on the
              course single page.
            </li>
            <li>Make Announcements to notify any important</li>
            <li>Notes to all enrolled students at once.</li>
          </ul>
        </div>
      </div>
    </>
  )
}
