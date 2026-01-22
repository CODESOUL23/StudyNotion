import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { requestInstructorVerification } from "../../../services/operations/profileAPI"
import { FaCheckCircle, FaClock, FaTimesCircle, FaUpload } from "react-icons/fa"
import { apiConnector } from "../../../services/apiconnector"
import { profileEndpoints } from "../../../services/apis"

const InstructorVerification = () => {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [documents, setDocuments] = useState("")
  const [loading, setLoading] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState(null)

  useEffect(() => {
    // Get current verification status from user
    if (user) {
      setVerificationStatus(user.verificationStatus || "pending")
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await requestInstructorVerification(token, documents)
    if (result) {
      setVerificationStatus("pending")
    }
    setLoading(false)
  }

  const renderStatusBadge = () => {
    switch (verificationStatus) {
      case "approved":
        return (
          <div className="flex items-center gap-2 bg-green-900/30 text-green-400 px-4 py-2 rounded-lg">
            <FaCheckCircle />
            <span>Verified Instructor</span>
          </div>
        )
      case "pending":
        return (
          <div className="flex items-center gap-2 bg-yellow-900/30 text-yellow-400 px-4 py-2 rounded-lg">
            <FaClock />
            <span>Verification Pending</span>
          </div>
        )
      case "rejected":
        return (
          <div className="flex items-center gap-2 bg-red-900/30 text-red-400 px-4 py-2 rounded-lg">
            <FaTimesCircle />
            <span>Verification Rejected</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-2 bg-richblack-700 text-richblack-300 px-4 py-2 rounded-lg">
            <span>Not Verified</span>
          </div>
        )
    }
  }

  return (
    <div className="text-white">
      <h1 className="mb-8 text-3xl font-medium text-richblack-5">
        Instructor Verification
      </h1>

      {/* Current Status */}
      <div className="mb-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8">
        <h2 className="text-xl font-semibold text-richblack-5 mb-4">
          Your Verification Status
        </h2>
        {renderStatusBadge()}

        {verificationStatus === "approved" && (
          <p className="mt-4 text-richblack-300">
            Congratulations! You are a verified instructor and can create courses.
          </p>
        )}

        {verificationStatus === "pending" && (
          <div className="mt-4">
            <p className="text-richblack-300">
              Your verification request is being reviewed. This usually takes 1-2 business days.
            </p>
            <p className="text-richblack-400 text-sm mt-2">
              You will receive an email once your request has been processed.
            </p>
          </div>
        )}

        {verificationStatus === "rejected" && (
          <div className="mt-4">
            <p className="text-richblack-300">
              Your verification request was rejected. Please review the feedback and submit again.
            </p>
            {user?.verificationRejectionReason && (
              <div className="mt-2 bg-red-900/20 border border-red-700 rounded-md p-3">
                <p className="text-red-400 text-sm">
                  <strong>Reason:</strong> {user.verificationRejectionReason}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Verification Request Form */}
      {(verificationStatus === "none" || verificationStatus === "rejected") && (
        <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8">
          <h2 className="text-xl font-semibold text-richblack-5 mb-4">
            Request Verification
          </h2>
          <p className="text-richblack-300 mb-6">
            To create courses on StudyNotion, instructors must be verified. Please provide 
            information about your qualifications and teaching experience.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-richblack-5 mb-2">
                Qualifications & Experience <span className="text-pink-200">*</span>
              </label>
              <textarea
                value={documents}
                onChange={(e) => setDocuments(e.target.value)}
                placeholder="Please describe your teaching experience, qualifications, certifications, and any relevant links (LinkedIn, portfolio, etc.)"
                className="w-full h-40 rounded-lg bg-richblack-700 p-4 text-richblack-5 outline-none border border-richblack-600 focus:border-yellow-50"
                required
              />
              <p className="text-richblack-400 text-sm mt-2">
                Include: Educational background, years of experience, relevant certifications, 
                LinkedIn profile, portfolio links, or any other credentials.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !documents.trim()}
              className="flex items-center gap-2 bg-yellow-50 text-richblack-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  <FaUpload />
                  Submit for Verification
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* What happens next */}
      <div className="mt-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8">
        <h2 className="text-xl font-semibold text-richblack-5 mb-4">
          What Happens Next?
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-richblack-300">
          <li>Submit your verification request with your qualifications</li>
          <li>Our team reviews your application (1-2 business days)</li>
          <li>You'll receive an email with the decision</li>
          <li>Once approved, you can start creating courses!</li>
        </ol>
      </div>
    </div>
  )
}

export default InstructorVerification
