import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { updateProfile } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitProfileForm = async (data) => {
    // console.log("Form Data - ", data)
    try {
      dispatch(updateProfile(token, data))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }
  return (
    <form onSubmit={handleSubmit(submitProfileForm)}>
      {/* Profile Information */}
      <div className="px-8 py-6">
        <div className="flex items-center justify-between pb-6 border-b border-richblack-700">
          <div>
            <h3 className="text-xl font-semibold text-richblack-5">Profile Information</h3>
            <p className="text-sm text-richblack-400 mt-1">Update your personal details</p>
          </div>
        </div>
        
        <div className="mt-6 space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName" className="text-sm font-medium text-richblack-5">
                First Name <span className="text-pink-200">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Enter first name"
                className="form-style bg-richblack-700 text-richblack-5 placeholder-richblack-400 focus:bg-richblack-600 transition-all duration-200"
                {...register("firstName", { required: true })}
                defaultValue={user?.firstName}
              />
              {errors.firstName && (
                <span className="text-xs text-pink-200">
                  Please enter your first name.
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="lastName" className="text-sm font-medium text-richblack-5">
                Last Name <span className="text-pink-200">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Enter last name"
                className="form-style bg-richblack-700 text-richblack-5 placeholder-richblack-400 focus:bg-richblack-600 transition-all duration-200"
                {...register("lastName", { required: true })}
                defaultValue={user?.lastName}
              />
              {errors.lastName && (
                <span className="text-xs text-pink-200">
                  Please enter your last name.
                </span>
              )}
            </div>
          </div>

          {/* DOB and Gender */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="dateOfBirth" className="text-sm font-medium text-richblack-5">
                Date of Birth <span className="text-pink-200">*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                className="form-style bg-richblack-700 text-richblack-5 placeholder-richblack-400 focus:bg-richblack-600 transition-all duration-200"
                {...register("dateOfBirth", {
                  required: {
                    value: true,
                    message: "Please enter your Date of Birth.",
                  },
                  max: {
                    value: new Date().toISOString().split("T")[0],
                    message: "Date of Birth cannot be in the future.",
                  },
                })}
                defaultValue={user?.additionalDetails?.dateOfBirth}
              />
              {errors.dateOfBirth && (
                <span className="text-xs text-pink-200">
                  {errors.dateOfBirth.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="gender" className="text-sm font-medium text-richblack-5">
                Gender <span className="text-pink-200">*</span>
              </label>
              <select
                name="gender"
                id="gender"
                className="form-style bg-richblack-700 text-richblack-5 placeholder-richblack-400 focus:bg-richblack-600 transition-all duration-200"
                {...register("gender", { required: true })}
                defaultValue={user?.additionalDetails?.gender}
              >
                {genders.map((ele, i) => {
                  return (
                    <option key={i} value={ele}>
                      {ele}
                    </option>
                  )
                })}
              </select>
              {errors.gender && (
                <span className="text-xs text-pink-200">
                  Please select your gender.
                </span>
              )}
            </div>
          </div>

          {/* Contact and About */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="contactNumber" className="text-sm font-medium text-richblack-5">
                Contact Number <span className="text-pink-200">*</span>
              </label>
              <input
                type="tel"
                name="contactNumber"
                id="contactNumber"
                placeholder="Enter Contact Number"
                className="form-style bg-richblack-700 text-richblack-5 placeholder-richblack-400 focus:bg-richblack-600 transition-all duration-200"
                {...register("contactNumber", {
                  required: {
                    value: true,
                    message: "Please enter your Contact Number.",
                  },
                  maxLength: { value: 12, message: "Invalid Contact Number" },
                  minLength: { value: 10, message: "Invalid Contact Number" },
                })}
                defaultValue={user?.additionalDetails?.contactNumber}
              />
              {errors.contactNumber && (
                <span className="text-xs text-pink-200">
                  {errors.contactNumber.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="about" className="text-sm font-medium text-richblack-5">
                About <span className="text-pink-200">*</span>
              </label>
              <input
                type="text"
                name="about"
                id="about"
                placeholder="Tell us about yourself"
                className="form-style bg-richblack-700 text-richblack-5 placeholder-richblack-400 focus:bg-richblack-600 transition-all duration-200"
                {...register("about", { required: true })}
                defaultValue={user?.additionalDetails?.about}
              />
              {errors.about && (
                <span className="text-xs text-pink-200">
                  Please enter your bio.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
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
        <IconBtn type="submit" text="Save Changes" />
      </div>
    </form>
  )
}
