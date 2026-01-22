import * as Icons from "react-icons/vsc"
import { useDispatch } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"

import { resetCourseState } from "../../../slices/courseSlice"

export default function SidebarLink({ link, iconName }) {
  const Icon = Icons[iconName]
  const location = useLocation()
  const dispatch = useDispatch()

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <NavLink
      to={link.path}
      onClick={() => dispatch(resetCourseState())}
      className={`relative px-4 py-3 text-sm font-medium rounded-lg mx-2 ${
        matchRoute(link.path)
          ? "bg-gradient-to-r from-yellow-800/80 to-yellow-900/50 text-yellow-50 shadow-md shadow-yellow-900/30"
          : "text-richblack-300 hover:text-richblack-5 hover:bg-richblack-700/50"
      } transition-all duration-200 group`}
    >
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-gradient-to-b from-yellow-50 to-yellow-100 ${
          matchRoute(link.path) ? "opacity-100" : "opacity-0"
        } transition-opacity duration-200`}
      ></span>
      <div className="flex items-center gap-x-3">
        {/* Icon Goes Here */}
        {Icon && <Icon className={`text-lg ${matchRoute(link.path) ? "text-yellow-50" : "text-richblack-400 group-hover:text-yellow-50"} transition-colors duration-200`} />}
        <span>{link.name}</span>
      </div>
    </NavLink>
  )
}
