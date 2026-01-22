import React from 'react';
import Template from "../components/core/Auth/Template";
import loginImg from "../assets/Images/login.webp";

const Login = ({setIsLoggedIn}) => {
    return (
        <div className="bg-gradient-to-b from-richblack-900 via-richblack-900 to-richblack-800 min-h-screen w-full">
            <Template
                image={loginImg}
                title="Welcome Back"
                desc1="Build skills for today, tomorrow and beyond"
                desc2="Education to future-proof your career"
                formType="login"
                setIsLoggedIn={setIsLoggedIn}
            ></Template>
        </div>
    );
};

export default Login;
