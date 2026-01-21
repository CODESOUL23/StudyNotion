import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RiEditBoxLine } from "react-icons/ri";
import { FiMail, FiPhone, FiCalendar, FiUser } from "react-icons/fi";
import { BsGenderAmbiguous } from "react-icons/bs";

const MyProfile = () => {
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();

    return (
        <div className="bg-richblack-900 min-h-screen w-full">
            <div className="mx-auto w-11/12 max-w-[1000px] py-10">
                {/* Header with gradient */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-richblack-5 mb-2">
                        My Profile
                    </h1>
                    <p className="text-richblack-300">
                        Manage your personal information and preferences
                    </p>
                </div>

                {/* Section 1: Profile Card with Cover */}
                <div className="mb-8 rounded-xl overflow-hidden shadow-lg border border-richblack-700">
                    {/* Cover gradient */}
                    <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    
                    {/* Profile Info */}
                    <div className="bg-richblack-800 px-8 pb-8">
                        <div className="flex items-end justify-between -mt-16 mb-6">
                            <div className="flex items-end gap-x-6">
                                <img
                                    src={user?.image}
                                    alt={`profile-${user?.firstName}`}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-richblack-800 shadow-xl"
                                />
                                <div className="pb-2">
                                    <h2 className="text-2xl font-bold text-richblack-5">
                                        {user?.firstName + " " + user?.lastName}
                                    </h2>
                                    <p className="text-richblack-300 flex items-center gap-2 mt-1">
                                        <FiMail className="w-4 h-4" />
                                        {user?.email}
                                    </p>
                                    <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-richblack-700 text-xs font-medium text-richblack-25">
                                        {user?.accountType}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate("/dashboard/settings")}
                                className="flex items-center gap-x-2 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-all duration-200 py-3 px-6 font-semibold text-richblack-900 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <RiEditBoxLine className="text-lg" />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section 2: About with card style */}
                <div className="mb-8 rounded-xl border border-richblack-700 bg-richblack-800 shadow-lg overflow-hidden">
                    <div className="flex items-center justify-between px-8 py-6 bg-richblack-700 bg-opacity-50">
                        <h3 className="text-xl font-semibold text-richblack-5 flex items-center gap-2">
                            <FiUser className="text-yellow-50" />
                            About Me
                        </h3>
                        <button
                            onClick={() => navigate("/dashboard/settings")}
                            className="flex items-center gap-x-2 rounded-lg bg-richblack-700 hover:bg-richblack-600 transition-all duration-200 py-2 px-4 font-medium text-richblack-5"
                        >
                            <RiEditBoxLine />
                            Edit
                        </button>
                    </div>
                    <div className="px-8 py-6">
                        <p className={`${
                            user?.additionalDetails?.about
                                ? "text-richblack-100"
                                : "text-richblack-400 italic"
                        } text-base leading-relaxed`}>
                            {user?.additionalDetails?.about ?? "Tell others about yourself... Share your interests, goals, and what makes you unique!"}
                        </p>
                    </div>
                </div>

                {/* Section 3: Personal Details Grid */}
                <div className="rounded-xl border border-richblack-700 bg-richblack-800 shadow-lg overflow-hidden">
                    <div className="flex items-center justify-between px-8 py-6 bg-richblack-700 bg-opacity-50">
                        <h3 className="text-xl font-semibold text-richblack-5">
                            Personal Information
                        </h3>
                        <button
                            onClick={() => navigate("/dashboard/settings")}
                            className="flex items-center gap-x-2 rounded-lg bg-richblack-700 hover:bg-richblack-600 transition-all duration-200 py-2 px-4 font-medium text-richblack-5"
                        >
                            <RiEditBoxLine />
                            Edit
                        </button>
                    </div>
                    <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div className="bg-richblack-700 bg-opacity-30 rounded-lg p-4 hover:bg-opacity-50 transition-all duration-200">
                            <p className="text-xs font-medium text-richblack-400 mb-2 uppercase tracking-wider">First Name</p>
                            <p className="text-base font-semibold text-richblack-5 flex items-center gap-2">
                                {user?.firstName}
                            </p>
                        </div>

                        {/* Last Name */}
                        <div className="bg-richblack-700 bg-opacity-30 rounded-lg p-4 hover:bg-opacity-50 transition-all duration-200">
                            <p className="text-xs font-medium text-richblack-400 mb-2 uppercase tracking-wider">Last Name</p>
                            <p className="text-base font-semibold text-richblack-5">
                                {user?.lastName}
                            </p>
                        </div>

                        {/* Email */}
                        <div className="bg-richblack-700 bg-opacity-30 rounded-lg p-4 hover:bg-opacity-50 transition-all duration-200">
                            <p className="text-xs font-medium text-richblack-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                                <FiMail className="w-3 h-3" /> Email
                            </p>
                            <p className="text-base font-semibold text-richblack-5 break-all">
                                {user?.email}
                            </p>
                        </div>

                        {/* Phone Number */}
                        <div className="bg-richblack-700 bg-opacity-30 rounded-lg p-4 hover:bg-opacity-50 transition-all duration-200">
                            <p className="text-xs font-medium text-richblack-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                                <FiPhone className="w-3 h-3" /> Phone Number
                            </p>
                            <p className={`${
                                user?.additionalDetails?.contactNumber
                                    ? "text-richblack-5"
                                    : "text-richblack-400 italic"
                            } text-base font-semibold`}>
                                {user?.additionalDetails?.contactNumber ?? "Add your contact number"}
                            </p>
                        </div>

                        {/* Gender */}
                        <div className="bg-richblack-700 bg-opacity-30 rounded-lg p-4 hover:bg-opacity-50 transition-all duration-200">
                            <p className="text-xs font-medium text-richblack-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                                <BsGenderAmbiguous className="w-3 h-3" /> Gender
                            </p>
                            <p className={`${
                                user?.additionalDetails?.gender
                                    ? "text-richblack-5"
                                    : "text-richblack-400 italic"
                            } text-base font-semibold`}>
                                {user?.additionalDetails?.gender ?? "Prefer not to say"}
                            </p>
                        </div>

                        {/* Date of Birth */}
                        <div className="bg-richblack-700 bg-opacity-30 rounded-lg p-4 hover:bg-opacity-50 transition-all duration-200">
                            <p className="text-xs font-medium text-richblack-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                                <FiCalendar className="w-3 h-3" /> Date of Birth
                            </p>
                            <p className={`${
                                user?.additionalDetails?.dateOfBirth
                                    ? "text-richblack-5"
                                    : "text-richblack-400 italic"
                            } text-base font-semibold`}>
                                {user?.additionalDetails?.dateOfBirth ?? "Add your birthday"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
