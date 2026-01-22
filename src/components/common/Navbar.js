import React, {useEffect, useState} from 'react';
import {Link, matchPath} from "react-router-dom";
import logo from "../../assets/Logo/Logo-Full-Light.png"
import {NavbarLinks} from "../../data/navbar-links"
import {useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {AiOutlineShoppingCart} from "react-icons/ai";
import ProfileDropdown from "../core/Auth/profileDropdown";
import {categories} from "../../services/apis";
import {apiConnector} from "../../services/apiconnector";
import { IoIosArrowDown } from "react-icons/io";

const subLinks = [
    {
        title : "Python",
        link:"catalog/python"
    },
    {
        title : "Web Development",
        link:"catalog/web-development"
    },
];

const Navbar = () => {

    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    const {totalItems} = useSelector((state) => state.cart);

    const location = useLocation();

    // const [subLinks, setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    // const fetchSubLinks = async() => {
    //     try {
    //         setLoading(true);
    //         setApiError(null);
    //         console.log("Fetching categories from API:", categories.CATEGORIES_API);
    //
    //         const result = await apiConnector("GET", categories.CATEGORIES_API);
    //         console.log("API Response:", result);
    //
    //         if (result?.data?.data?.allCategories) {
    //             console.log("Categories found:", result.data.data.allCategories);
    //             setSubLinks(result.data.data.allCategories);
    //         } else {
    //             console.log("No categories found in response structure:", result.data);
    //             setApiError("Categories data structure is incorrect");
    //         }
    //     } catch(err) {
    //         console.error("Error fetching categories:", err);
    //         setApiError(err.message || "Could not fetch categories");
    //     } finally {
    //         setLoading(false);
    //     }
    // }
    //
    // useEffect(() => {
    //     fetchSubLinks();
    // }, [])

    const matchRoutes = (route) => {
        return matchPath({path:route}, location.pathname)
    }
    
    return (
        <div className="flex h-16 items-center justify-center border-b border-richblack-700/50 bg-richblack-900/95 backdrop-blur-lg sticky top-0 z-50 shadow-lg shadow-black/10">
            <div className="flex w-11/12 max-w-maxContent items-center justify-between">
                <Link to="/" className="transition-transform duration-200 hover:scale-105">
                    <img src={logo} alt="" width={160} height={42} loading={"lazy"}/>
                </Link>

                {/* Nav Links */}
                <nav>
                    <ul className="flex gap-x-8 text-richblack-25">
                        {
                            NavbarLinks.map((link, index) => (
                                <li key={index}>
                                    {
                                        link.title === "Catalog" ? (
                                            <div className="relative group flex items-center gap-1">
                                                <p className="cursor-pointer hover:text-yellow-25 transition-colors duration-200">{link.title}</p>
                                                {/*{loading && <p className="text-xs text-yellow-50">Loading categories...</p>}*/}
                                                {/*{apiError && <p className="text-xs text-pink-200">Error: {apiError}</p>}*/}
                                                {/*{subLinks.length > 0 && (*/}
                                                {/*    <div className="invisible absolute left-0 z-[1000] flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px]">*/}
                                                {/*        {subLinks.map((category, i) => (*/}
                                                {/*            <Link to={`/catalog/${category.name.split(" ").join("-").toLowerCase()}`} key={i}>*/}
                                                {/*                <p className="rounded-lg py-2 pl-2 hover:bg-richblack-50">*/}
                                                {/*                    {category.name}*/}
                                                {/*                </p>*/}
                                                {/*            </Link>*/}
                                                {/*        ))}*/}
                                                {/*    </div>*/}
                                                {/*)}*/}

                                                <IoIosArrowDown className="transition-transform duration-200 group-hover:rotate-180" />

                                                <div className="z-10 invisible absolute left-[50%] top-[100%] flex flex-col rounded-xl translate-x-[-50%] translate-y-[10px]
                                                bg-richblack-800 p-2 text-richblack-5 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100 lg:w-[280px]
                                                border border-richblack-700 shadow-xl shadow-black/40 backdrop-blur-lg">

                                                    <div className="absolute translate-y-[-50%] left-[50%] translate-x-[-50%] top-0 h-4 w-4 
                                                    rotate-45 rounded-sm bg-richblack-800 border-l border-t border-richblack-700"></div>

                                                        {
                                                            subLinks.length ? (
                                                                <div className="relative z-10">
                                                                    {
                                                                        subLinks.map((category, i) => (
                                                                            <Link to={`/${category.link}`} key={i}>
                                                                                <p className="text-richblack-100 rounded-lg py-3 px-4 hover:bg-richblack-700 hover:text-yellow-50 transition-all duration-200 font-medium">
                                                                                    {category.title}
                                                                                </p>
                                                                            </Link>
                                                                        ))
                                                                    }
                                                                </div>
                                                            ) : (<div></div>)
                                                        }

                                                </div>
                                            </div>
                                        ) : (
                                            <Link to={link?.path}>
                                                <p className={`${matchRoutes(link?.path) ? "text-yellow-25" : "text-richblack-25"} hover:text-yellow-25 transition-colors duration-200 font-medium`}>
                                                    {link.title}
                                                </p>
                                            </Link>
                                        )
                                    }
                                </li>
                            ))
                        }
                    </ul>
                </nav>

                {/* Login/Signup/dashboard */}
                <div className="flex gap-x-4 items-center">
                    {
                        user && user?.accountType !== "Instructor" && (
                            <Link to="/dashboard/cart" className="relative text-richblack-25 text-2xl hover:text-yellow-25 transition-colors duration-200 p-2">
                                <AiOutlineShoppingCart/>
                                {
                                    totalItems > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-50 to-yellow-25 text-richblack-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg shadow-yellow-50/30 animate-pulse">
                                            {totalItems}
                                        </span>
                                    )
                                }
                            </Link>
                        )
                    }
                    {
                        token === null && (
                            <Link to="/login">
                                <button className="border border-richblack-600 bg-richblack-800 px-5 py-2.5
                                text-richblack-100 rounded-lg hover:bg-richblack-700 hover:border-richblack-500 hover:text-richblack-5 
                                transition-all duration-200 font-medium shadow-md shadow-black/20">
                                    Log in
                                </button>
                            </Link>
                        )
                    }
                    {
                        token === null && (
                            <Link to="/signup">
                                <button className="bg-gradient-to-r from-yellow-50 to-yellow-25 px-5 py-2.5
                                text-richblack-900 rounded-lg hover:shadow-lg hover:shadow-yellow-50/25 
                                transition-all duration-200 font-semibold">
                                    Sign up
                                </button>
                            </Link>
                        )
                    }
                    {
                        token !== null && <ProfileDropdown />
                    }
                </div>
            </div>
        </div>
    );
};

export default Navbar;
