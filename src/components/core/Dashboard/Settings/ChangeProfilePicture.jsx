import { useEffect, useRef, useState } from "react"
import { FiUpload } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"

import { updateDisplayPicture } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"

export default function ChangeProfilePicture() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(null)

  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    // console.log(file)
    if (file) {
      setImageFile(file)
      previewFile(file)
    }
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  const handleFileUpload = () => {
    try {
      console.log("uploading...")
      setLoading(true)
      const formData = new FormData()
      formData.append("displayPicture", imageFile)
      // console.log("formdata", formData)
      dispatch(updateDisplayPicture(token, formData)).then(() => {
        setLoading(false)
      })
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile)
    }
  }, [imageFile])
  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between pb-6 border-b border-richblack-700">
        <h3 className="text-xl font-semibold text-richblack-5">Profile Picture</h3>
        <p className="text-sm text-richblack-400">Update your profile photo</p>
      </div>
      
      <div className="flex items-center gap-x-6 mt-6">
        <div className="relative group">
          <img
            src={previewSource || user?.image}
            alt={`profile-${user?.firstName}`}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-richblack-700 group-hover:ring-yellow-50 transition-all duration-300"
          />
          {previewSource && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">Preview</span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <p className="text-base font-medium text-richblack-5 mb-2">
            Choose a new profile picture
          </p>
          <p className="text-sm text-richblack-400 mb-4">
            JPG, PNG or GIF. Max size 2MB
          </p>
          <div className="flex gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/gif, image/jpeg"
            />
            <button
              onClick={handleClick}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-richblack-700 hover:bg-richblack-600 font-medium text-richblack-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select File
            </button>
            <IconBtn
              text={loading ? "Uploading..." : "Upload"}
              onclick={handleFileUpload}
              disabled={!imageFile || loading}
              customClasses={!imageFile && !loading ? "opacity-50 cursor-not-allowed" : ""}
            >
              {!loading && (
                <FiUpload className="text-lg text-richblack-900" />
              )}
            </IconBtn>
          </div>
        </div>
      </div>
    </div>
  )
}
