import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { changePassword } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitPasswordForm = async (data) => {
    // console.log("password Data - ", data)
    try {
      await changePassword(token, data)
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(submitPasswordForm)}>
      <div className="px-8 py-6">
        <div className="flex items-center justify-between pb-6 border-b border-richblack-700">
          <div>
            <h3 className="text-xl font-semibold text-richblack-5">Change Password</h3>
            <p className="text-sm text-richblack-400 mt-1">Update your password regularly to keep your account secure</p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="relative flex flex-col gap-2">
            <label htmlFor="oldPassword" className="text-sm font-medium text-richblack-5">
              Current Password <span className="text-pink-200">*</span>
            </label>
            <input
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              id="oldPassword"
              placeholder="Enter Current Password"
              className="form-style bg-richblack-700 text-richblack-5 placeholder-richblack-400 focus:bg-richblack-600 transition-all duration-200 pr-10"
              {...register("oldPassword", { required: true })}
            />
            <span
              onClick={() => setShowOldPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer hover:scale-110 transition-transform"
            >
              {showOldPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
            {errors.oldPassword && (
              <span className="text-xs text-pink-200">
                Please enter your current password.
              </span>
            )}
          </div>
          <div className="relative flex flex-col gap-2">
            <label htmlFor="newPassword" className="text-sm font-medium text-richblack-5">
              New Password <span className="text-pink-200">*</span>
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              id="newPassword"
              placeholder="Enter New Password"
              className="form-style bg-richblack-700 text-richblack-5 placeholder-richblack-400 focus:bg-richblack-600 transition-all duration-200 pr-10"
              {...register("newPassword", { required: true })}
            />
            <span
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer hover:scale-110 transition-transform"
            >
              {showNewPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
            {errors.newPassword && (
              <span className="text-xs text-pink-200">
                Please enter your new password.
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 px-8 py-6 bg-richblack-700 bg-opacity-30">
        <button
          onClick={() => {
            navigate("/dashboard/my-profile")
          }}
          type="button"
          className="px-6 py-2.5 rounded-lg bg-richblack-700 hover:bg-richblack-600 font-medium text-richblack-50 transition-all duration-200"
        >
          Cancel
        </button>
        <IconBtn type="submit" text="Update Password" />
      </div>
    </form>
  )
}
