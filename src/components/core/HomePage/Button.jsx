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
            <div className={`text-center text-sm px-7 py-3.5 rounded-lg font-semibold
                ${active 
                    ? "bg-gradient-to-r from-yellow-50 to-yellow-25 text-richblack-900 shadow-lg shadow-yellow-50/20 hover:shadow-xl hover:shadow-yellow-50/30" 
                    : "bg-richblack-800 text-richblack-5 border border-richblack-600 hover:bg-richblack-700"
                } 
                hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}>
                {children}
            </div>
        </Link>
    );
};

export default CTAButton;
