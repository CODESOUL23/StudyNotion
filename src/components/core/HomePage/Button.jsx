import React from 'react';
import {Link} from "react-router-dom";
import { useSelector } from 'react-redux';

const CTAButton = ({children, active, linkto, authRequired = false, loggedInLink}) => {
    const { token } = useSelector((state) => state.auth);
    
    // Determine the actual link based on auth state
    const getLink = () => {
        // If authRequired is true, redirect to signup/login when not logged in
        if (authRequired && !token) {
            return "/signup";
        }
        // If logged in and there's a different loggedInLink, use that
        if (token && loggedInLink) {
            return loggedInLink;
        }
        return linkto;
    };

    return (
        <Link to={getLink()}>
            <div className={`text-center text-[13px] px-6 py-3 rounded-md font-bold
                ${active ? "bg-yellow-50 text-black" : "bg-richblack-800 text-white"} 
                hover:scale-95 transition-all duration-200`}>
                {children}
            </div>
        </Link>
    );
};

export default CTAButton;
