import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Instructor from "../../../assets/Images/Instructor.png"
import HighlightText from "./HighlightText";
import {FaArrowRight} from "react-icons/fa";
import AnimatedSection from "../../common/AnimatedSection";

const InstructorSection = () => {
    const { token } = useSelector((state) => state.auth);
    
    return (
        <div className="">
            <div className="flex flex-row gap-20 items-center">

                <AnimatedSection animation="fadeLeft" delay={0} className="w-[50%] mt-20 ml-24">
                    <img src={Instructor} alt="Instructor Image" className="shadow-[-18px_-18px_0px_0px_rgba(255,_255,_255,_1)]"/>
                </AnimatedSection>

                <AnimatedSection animation="fadeRight" delay={100} className="w-[50%] flex flex-col">
                    <p className="text-4xl font-semibold">Become an <br/>
                        <HighlightText text="Instructor"></HighlightText>
                    </p>
                    <p className="font-medium text-[16px] text-richblack-300 w-[80%] mt-10">Instructors from around the world teach millions of students on StudyNotion.
                        We provide the tools and skills to teach what you love.</p>

                    <div className="w-fit mt-10">
                        <Link to={token ? "/dashboard/instructor" : "/signup"}>
                            <div className="text-center text-[13px] px-6 py-3 rounded-md font-bold bg-yellow-50 text-black hover:scale-95 transition-all duration-200">
                                <div className="flex flex-row gap-2 items-center">
                                    <p>Start Teaching Today</p>
                                    <FaArrowRight></FaArrowRight>
                                </div>
                            </div>
                        </Link>
                        <div className="mt-8 mb-5">
                            <Link to={token ? "/dashboard/my-profile" : "/signup"}>
                                <div className="text-center text-[13px] px-4 py-2 rounded-md font-bold bg-yellow-50 text-black hover:scale-95 transition-all duration-200">
                                    Get Started
                                </div>
                            </Link>
                        </div>
                    </div>

                </AnimatedSection>
            </div>
        </div>
    );
};

export default InstructorSection;
