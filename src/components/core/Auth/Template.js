import React from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const Template = ({ image, title, desc1, desc2, formType }) => {
    return (
        <div className="flex justify-between w-11/12 max-w-[1160px] py-12 mx-auto gap-x-12 gap-y-0">
            {/* Left Section - Form */}
            <div className="w-11/12 max-w-[450px]">
                <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">
                    {title}
                </h1>
                <p className="text-[1.125rem] leading-[1.625rem] mt-4">
                    <span className="text-richblack-100">{desc1}</span>
                    <br />
                    <span className="text-blue-100 italic">{desc2}</span>
                </p>

                {formType === "signup" ? <SignupForm /> : <LoginForm />}
            </div>

            {/* Right Section - Image */}
            <div className="relative w-11/12 max-w-[450px] mt-10">
                {image && (
                    <img
                        src={image}
                        alt="Pattern"
                        width={558}
                        height={504}
                        loading="lazy"
                        className="absolute -top-4 right-4"
                    />
                )}
            </div>
        </div>
    );
};

export default Template;
