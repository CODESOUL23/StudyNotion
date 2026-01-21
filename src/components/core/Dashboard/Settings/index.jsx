import ChangeProfilePicture from "./ChangeProfilePicture"
import DeleteAccount from "./DeleteAccount"
import EditProfile from "./EditProfile"
import UpdatePassword from "./UpdatePassword"
import { FiSettings } from "react-icons/fi"

export default function Settings() {
  return (
    <div className="space-y-8">
      {/* Header with gradient accent */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
            <FiSettings className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-richblack-5">Settings</h1>
            <p className="text-richblack-300 mt-1">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Settings Cards with spacing */}
      <div className="space-y-6">
        {/* Change Profile Picture */}
        <div className="rounded-xl border border-richblack-700 bg-richblack-800 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <ChangeProfilePicture />
        </div>

        {/* Profile */}
        <div className="rounded-xl border border-richblack-700 bg-richblack-800 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <EditProfile />
        </div>

        {/* Password */}
        <div className="rounded-xl border border-richblack-700 bg-richblack-800 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <UpdatePassword />
        </div>

        {/* Delete Account */}
        <div className="rounded-xl border border-richblack-700 bg-richblack-800 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <DeleteAccount />
        </div>
      </div>
    </div>
  )
}
