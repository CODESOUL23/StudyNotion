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
