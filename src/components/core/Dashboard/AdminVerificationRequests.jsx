import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import {
  getVerificationRequests,
  approveInstructor,
  rejectInstructor,
} from "../../../services/operations/profileAPI"
import { FaCheckCircle, FaTimesCircle, FaUser, FaEnvelope, FaCalendar } from "react-icons/fa"
import ConfirmationModal from "../../common/ConfirmationModal"

const AdminVerificationRequests = () => {
  const { token } = useSelector((state) => state.auth)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [rejectModal, setRejectModal] = useState(null)
  const [rejectReason, setRejectReason] = useState("")

  const fetchRequests = async () => {
    setLoading(true)
    const result = await getVerificationRequests(token)
    setRequests(result || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleApprove = async (instructorId) => {
    const result = await approveInstructor(token, instructorId)
    if (result) {
      // Remove from pending list
      setRequests(requests.filter((req) => req._id !== instructorId))
    }
    setConfirmationModal(null)
  }

  const handleReject = async (instructorId) => {
    const result = await rejectInstructor(token, instructorId, rejectReason)
    if (result) {
      // Remove from pending list
      setRequests(requests.filter((req) => req._id !== instructorId))
    }
    setRejectModal(null)
    setRejectReason("")
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

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
        Instructor Verification Requests
      </h1>

      {requests.length === 0 ? (
        <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-12 text-center">
          <p className="text-richblack-300 text-lg">
            No pending verification requests
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-richblack-300 mb-4">
            {requests.length} pending request{requests.length !== 1 ? "s" : ""}
          </p>

          {requests.map((request) => (
            <div
              key={request._id}
              className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
            >
              {/* Header with user info */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      request.image ||
                      `https://api.dicebear.com/5.x/initials/svg?seed=${request.firstName} ${request.lastName}`
                    }
                    alt={`${request.firstName} ${request.lastName}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-richblack-5">
                      {request.firstName} {request.lastName}
                    </h3>
                    <div className="flex items-center gap-2 text-richblack-300 text-sm mt-1">
                      <FaEnvelope className="text-richblack-400" />
                      {request.email}
                    </div>
                    <div className="flex items-center gap-2 text-richblack-400 text-sm mt-1">
                      <FaCalendar />
                      Requested: {formatDate(request.verificationRequestedAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents/Qualifications */}
              <div className="mb-6">
                <h4 className="text-richblack-5 font-medium mb-2">
                  Qualifications & Experience:
                </h4>
                <div className="bg-richblack-700 rounded-lg p-4 text-richblack-100 whitespace-pre-wrap">
                  {request.verificationDocuments?.bio || 
                   request.verificationDocuments?.experience || 
                   JSON.stringify(request.verificationDocuments, null, 2) || 
                   "No details provided"}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Approve Instructor",
                      text2: `Are you sure you want to approve ${request.firstName} ${request.lastName} as a verified instructor?`,
                      btn1Text: "Approve",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleApprove(request._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  <FaCheckCircle />
                  Approve
                </button>
                <button
                  onClick={() => setRejectModal(request)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  <FaTimesCircle />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
          <div className="w-11/12 max-w-[450px] rounded-lg border border-richblack-400 bg-richblack-800 p-6">
            <h2 className="text-2xl font-semibold text-richblack-5 mb-4">
              Reject Instructor
            </h2>
            <p className="text-richblack-200 mb-4">
              Rejecting {rejectModal.firstName} {rejectModal.lastName}'s
              verification request.
            </p>
            <div className="mb-4">
              <label className="block text-richblack-5 mb-2">
                Reason for Rejection (optional)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Provide feedback for the instructor..."
                className="w-full h-24 rounded-lg bg-richblack-700 p-3 text-richblack-5 outline-none border border-richblack-600 focus:border-pink-200"
              />
            </div>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => {
                  setRejectModal(null)
                  setRejectReason("")
                }}
                className="px-4 py-2 rounded-lg bg-richblack-600 text-richblack-5 font-medium hover:bg-richblack-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectModal._id)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-200"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminVerificationRequests
