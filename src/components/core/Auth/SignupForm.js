import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../../../services/operations/authAPI";
import { setSignupData } from "../../../slices/authSlice";

function SignupForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [accountType, setAccountType] = useState("Student");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { firstName, lastName, email, password, confirmPassword } = formData;

    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords Do Not Match");
            return;
        }
        const signupData = {
            ...formData,
            accountType,
        };

        // Setting signup data to state
        dispatch(setSignupData(signupData));
        // Send OTP to user for verification
        dispatch(sendOtp(formData.email, navigate));

        // Reset
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
        setAccountType("Student");
    };

    return (
        <div>
            {/* Student-Instructor toggle */}
            <div className="flex bg-richblack-800 p-1 gap-x-1 my-6 rounded-full max-w-max">
                <button
                    className={`${
                        accountType === "Student"
                            ? "bg-richblack-900 text-richblack-5"
                            : "bg-transparent text-richblack-200"
                    } py-2 px-5 rounded-full transition-all duration-200`}
                    onClick={() => setAccountType("Student")}
                >
                    Student
                </button>
                <button
                    className={`${
                        accountType === "Instructor"
                            ? "bg-richblack-900 text-richblack-5"
                            : "bg-transparent text-richblack-200"
                    } py-2 px-5 rounded-full transition-all duration-200`}
                    onClick={() => setAccountType("Instructor")}
                >
                    Instructor
                </button>
            </div>

            <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
                <div className="flex gap-x-4">
                    <label>
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
                            First Name <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                            required
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={handleOnChange}
                            placeholder="Enter first name"
                            className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
                        />
                    </label>
                    <label>
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
                            Last Name <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                            required
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={handleOnChange}
                            placeholder="Enter last name"
                            className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
                        />
                    </label>
                </div>
                <label className="w-full">
                    <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
                        Email Address <sup className="text-pink-200">*</sup>
                    </p>
                    <input
                        required
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleOnChange}
                        placeholder="Enter email address"
                        className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
                    />
                </label>
                <div className="flex gap-x-4">
                    <label className="relative">
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
                            Create Password <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                            required
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={password}
                            onChange={handleOnChange}
                            placeholder="Enter Password"
                            className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
                        />
                        <span
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                        >
                            {showPassword ? (
                                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                            ) : (
                                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                            )}
                        </span>
                    </label>
                    <label className="relative">
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
                            Confirm Password <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                            required
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleOnChange}
                            placeholder="Confirm Password"
                            className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
                        />
                        <span
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                        >
                            {showConfirmPassword ? (
                                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                            ) : (
                                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                            )}
                        </span>
                    </label>
                </div>
                <button
                    type="submit"
                    className="bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-6"
                >
                    Create Account
                </button>
            </form>
        </div>
    );
}

export default SignupForm;
