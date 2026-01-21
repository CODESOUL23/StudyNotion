import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { deleteProfile } from "../../../../services/operations/SettingsAPI"

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <div className="px-8 py-6">
      <div className="flex items-start gap-6 p-6 rounded-lg bg-gradient-to-r from-pink-900/30 to-red-900/30 border border-pink-700/50">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-700 to-red-700 shadow-lg">
            <FiTrash2 className="text-3xl text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-richblack-5 mb-2">
            Delete Account
          </h3>
          <div className="space-y-2 text-sm text-pink-100">
            <p className="font-medium">Are you sure you want to delete your account?</p>
            <p className="text-pink-200">
              This account may contain paid courses. Deleting your account is
              <span className="font-semibold"> permanent </span>
              and will remove all content associated with it.
            </p>
          </div>
          <button
            type="button"
            className="mt-4 px-5 py-2.5 rounded-lg bg-gradient-to-r from-pink-700 to-red-700 hover:from-pink-600 hover:to-red-600 font-medium text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            onClick={handleDeleteAccount}
          >
            I want to delete my account
          </button>
        </div>
      </div>
    </div>
  )
}
