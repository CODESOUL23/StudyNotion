import "./App.css";
import {Route , Routes} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import MyProfile from "./pages/MyProfile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BookDemo from "./pages/BookDemo";
import useAuthPersistence from "./hooks/useAuthPersistence";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useSelector } from "react-redux";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Instructor from "./components/core/Dashboard/Instructor";
import Settings from "./components/core/Dashboard/Settings";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import InstructorVerification from "./components/core/Dashboard/InstructorVerification";
import AdminVerificationRequests from "./components/core/Dashboard/AdminVerificationRequests";
import AdminDashboard from "./components/core/Dashboard/AdminDashboard";
import AdminAllInstructors from "./components/core/Dashboard/AdminAllInstructors";
import AdminEnrolledStudents from "./components/core/Dashboard/AdminEnrolledStudents";
import AdminDemoStudents from "./components/core/Dashboard/AdminDemoStudents";
import AdminAllCourses from "./components/core/Dashboard/AdminAllCourses";
import AdminInstructorProfile from "./components/core/Dashboard/AdminInstructorProfile";

function App() {
  useAuthPersistence();
  const { user } = useSelector((state) => state.profile)
  
  return (
      <div className="w-screen min-h-screen flex flex-col font-inter bg-richblack-900">
          <Navbar></Navbar>
          <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/signup" element={<Signup/>} />
              <Route path="/verify-email" element={<VerifyEmail/>} />
              <Route path="/about" element={<About/>} />
              <Route path="/contact" element={<Contact/>} />
              <Route path="/book-demo" element={<BookDemo/>} />
              <Route path="/catalog/:catalogName" element={<Catalog/>} />
              <Route path="/courses/:courseId" element={<CourseDetails/>} />
              
              {/* Dashboard Routes */}
              <Route element={<Dashboard />}>
                <Route path="/dashboard/my-profile" element={<MyProfile/>} />
                <Route path="/dashboard/settings" element={<Settings />} />
                {
                  user?.accountType === ACCOUNT_TYPE.STUDENT && (
                    <>
                      <Route path="/dashboard/cart" element={<Cart />} />
                      <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses />} />
                    </>
                  )
                }
                {
                  user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                    <>
                      <Route path="/dashboard/instructor" element={<Instructor />} />
                      <Route path="/dashboard/add-course" element={<AddCourse />} />
                      <Route path="/dashboard/my-courses" element={<MyCourses />} />
                      <Route path="/dashboard/edit-course/:courseId" element={<EditCourse />} />
                      <Route path="/dashboard/verification" element={<InstructorVerification />} />
                    </>
                  )
                }
                {
                  user?.accountType === ACCOUNT_TYPE.ADMIN && (
                    <>
                      <Route path="/dashboard/admin" element={<AdminDashboard />} />
                      <Route path="/dashboard/admin/verification-requests" element={<AdminVerificationRequests />} />
                      <Route path="/dashboard/admin/instructors" element={<AdminAllInstructors />} />
                      <Route path="/dashboard/admin/instructor/:instructorId" element={<AdminInstructorProfile />} />
                      <Route path="/dashboard/admin/enrolled-students" element={<AdminEnrolledStudents />} />
                      <Route path="/dashboard/admin/demo-students" element={<AdminDemoStudents />} />
                      <Route path="/dashboard/admin/courses" element={<AdminAllCourses />} />
                    </>
                  )
                }
              </Route>

              {/* View Course Routes */}
              <Route element={<ViewCourse />}>
                <Route path="/view-course/:courseId/section/:sectionId/sub-section/:subSectionId" element={<VideoDetails />} />
              </Route>

              {/* 404 Error Page */}
              <Route path="*" element={<Error/>} />
          </Routes>
      </div>
  );
}

export default App;
