import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../services/operations/authAPI";

function LoginForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const { email, password } = formData;

    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(login(email, password, navigate));
    };

    return (
        <form
            onSubmit={handleOnSubmit}
            className="flex w-full flex-col gap-y-5 mt-8"
        >
            <label className="w-full">
                <p className="text-sm text-richblack-5 mb-2 leading-[1.375rem] font-medium">
                    Email Address <sup className="text-pink-200">*</sup>
                </p>
                <input
                    required
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleOnChange}
                    placeholder="Enter email address"
                    className="bg-richblack-800 rounded-lg text-richblack-5 w-full p-3.5 border border-richblack-700 focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50/20 outline-none transition-all duration-200 placeholder:text-richblack-400"
                />
            </label>
            <label className="w-full relative">
                <p className="text-sm text-richblack-5 mb-2 leading-[1.375rem] font-medium">
                    Password <sup className="text-pink-200">*</sup>
                </p>
                <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={handleOnChange}
                    placeholder="Enter Password"
                    className="bg-richblack-800 rounded-lg text-richblack-5 w-full p-3.5 pr-12 border border-richblack-700 focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50/20 outline-none transition-all duration-200 placeholder:text-richblack-400"
                />
                <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-[42px] z-[10] cursor-pointer hover:opacity-80 transition-opacity"
                >
                    {showPassword ? (
                        <AiOutlineEyeInvisible fontSize={22} fill="#AFB2BF" />
                    ) : (
                        <AiOutlineEye fontSize={22} fill="#AFB2BF" />
                    )}
                </span>
                <Link to="/forgot-password">
                    <p className="text-xs mt-2 text-blue-100 max-w-max ml-auto hover:text-blue-50 transition-colors">
                        Forgot Password?
                    </p>
                </Link>
            </label>
            <button
                type="submit"
                className="bg-gradient-to-r from-yellow-50 to-yellow-25 rounded-lg font-semibold text-richblack-900 px-6 py-3.5 mt-4 hover:shadow-lg hover:shadow-yellow-50/25 transition-all duration-200 active:scale-[0.98]"
            >
                Sign In
            </button>
        </form>
    );
}

export default LoginForm;
