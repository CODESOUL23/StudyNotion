import React from 'react';
import Template from "../components/core/Auth/Template";
import signupImg from "../assets/Images/signup.webp";

const Signup = ({setIsLoggedIn}) => {
    return (
        <div className="bg-richblack-900 min-h-screen w-full">
            <Template
                image={signupImg}
                title="Join the millions learning to code with StudyNotion for free"
                desc1="Build skills for today, tomorrow, and beyond."
                desc2="Education to future-proof your career."
                formType="signup"
                setIsLoggedIn={setIsLoggedIn}
            />
        </div>
    );
};

export default Signup;
