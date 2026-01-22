import React, { useRef, useState } from 'react';
import { AiOutlineCaretDown } from "react-icons/ai";
import { VscDashboard, VscSignOut } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../services/operations/authAPI";
import useOnClickOutside from "../../../hooks/useOnClickOutside";

const ProfileDropdown = () => {
    const { user } = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useOnClickOutside(ref, () => setOpen(false));

    if (!user) return null;

    return (
        <button className="relative" onClick={() => setOpen(true)}>
            <div className="flex items-center gap-x-2 group">
                <img
                    src={user?.image}
                    alt={`profile-${user?.firstName}`}
                    className="aspect-square w-9 h-9 rounded-full object-cover ring-2 ring-richblack-600 group-hover:ring-yellow-50 transition-all duration-200"
                />
                <AiOutlineCaretDown className={`text-sm text-richblack-300 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </div>
            {open && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-[130%] right-0 z-[1000] divide-y divide-richblack-700/50 overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800 shadow-xl shadow-black/40 min-w-[160px] backdrop-blur-lg"
                    ref={ref}
                >
                    <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
                        <div className="flex w-full items-center gap-x-3 py-3 px-4 text-sm text-richblack-100 hover:bg-richblack-700 hover:text-yellow-50 transition-all duration-200">
                            <VscDashboard className="text-lg" />
                            Dashboard
                        </div>
                    </Link>
                    <div
                        onClick={() => {
                            dispatch(logout(navigate));
                            setOpen(false);
                        }}
                        className="flex w-full items-center gap-x-3 py-3 px-4 text-sm text-richblack-100 hover:bg-pink-900/30 hover:text-pink-200 transition-all duration-200 cursor-pointer"
                    >
                        <VscSignOut className="text-lg" />
                        Logout
                    </div>
                </div>
            )}
        </button>
    );
};

export default ProfileDropdown;
