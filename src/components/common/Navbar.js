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
        <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 bg-richblack-900">
            <div className="flex w-11/12 max-w-maxContent items-center justify-between">
                <Link to="/">
                    <img src={logo} alt="" width={160} height={42} loading={"lazy"}/>
                </Link>

                {/* Nav Links */}
                <nav>
                    <ul className="flex gap-x-6 text-richblack-25">
                        {
                            NavbarLinks.map((link, index) => (
                                <li key={index}>
                                    {
                                        link.title === "Catalog" ? (
                                            <div className="relative group flex items-center gap-1">
                                                <p className="cursor-pointer">{link.title}</p>
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

                                                <IoIosArrowDown />

                                                <div className=" z-10 invisible absolute left-[50%] top-[80%] flex flex-col rounded-md translate-x-[-50%] translate-y-[50%]
                                                bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px]">

                                                    <div className="absolute translate-y-[-40%] translate-x-[70%] left-[50%] top-0 h-6
                                                    w-6 -rotate-45 rounded bg-richblue-5"> </div>

                                                        {
                                                            subLinks.length ? (
                                                                <div>
                                                                    {
                                                                        subLinks.map((category, i) => (
                                                                            <Link to={`/${category.link}`} key={i}>
                                                                                <p className="text-black rounded-lg py-2 pl-2 hover:bg-richblack-50">
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
                                                <p className={`${matchRoutes(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
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
                            <Link to="/dashboard/cart" className="relative text-richblack-25 text-2xl">
                                <AiOutlineShoppingCart/>
                                {
                                    totalItems > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-yellow-25 text-richblack-900 rounded-full w-5 h-5 flex items-center justify-center text-sm font-semibold">
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
                                <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px]
                                text-richblack-100 rounded-md hover:bg-richblack-700 transition-all duration-200">
                                    Log in
                                </button>
                            </Link>
                        )
                    }
                    {
                        token === null && (
                            <Link to="/signup">
                                <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px]
                                text-richblack-100 rounded-md hover:bg-richblack-700 transition-all duration-200">
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
