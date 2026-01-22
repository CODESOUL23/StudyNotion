import React from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const Template = ({ image, title, desc1, desc2, formType }) => {
    return (
        <div className="flex justify-between w-11/12 max-w-[1160px] py-16 mx-auto gap-x-16 gap-y-0">
            {/* Left Section - Form */}
            <div className="w-11/12 max-w-[480px]">
                <h1 className="text-richblack-5 font-bold text-[2rem] leading-[2.5rem] mb-3">
                    {title}
                </h1>
                <p className="text-[1.125rem] leading-[1.75rem] mb-8">
                    <span className="text-richblack-100">{desc1}</span>
                    <br />
                    <span className="text-blue-100 italic font-medium">{desc2}</span>
                </p>

                {formType === "signup" ? <SignupForm /> : <LoginForm />}
            </div>

            {/* Right Section - Image */}
            <div className="relative w-11/12 max-w-[500px] mt-10 hidden md:block">
                {image && (
                    <div className="relative">
                        {/* Glow effect behind image */}
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-50/10 to-blue-200/10 blur-3xl rounded-full transform scale-75"></div>
                        <img
                            src={image}
                            alt="Pattern"
                            width={558}
                            height={504}
                            loading="lazy"
                            className="relative z-10 drop-shadow-2xl"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Template;
