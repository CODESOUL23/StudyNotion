import React from 'react';
import { useSelector } from 'react-redux';
import HighlightText from "./HighlightText";
import know from "../../../assets/Images/Know_your_progress.png";
import plan from "../../../assets/Images/Plan_your_lessons.png";
import compare from "../../../assets/Images/Compare_with_others.png";
import { Link } from "react-router-dom";
import AnimatedSection from "../../common/AnimatedSection";

const LearningLanguagesection = () => {
    const { token } = useSelector((state) => state.auth);
    
    return (
        <>
            <div className="flex flex-col items-center gap-5 mt-[130px] w-11/12">
                <AnimatedSection animation="fadeUp" delay={0}>
                    <div className="text-4xl font-semibold text-center text-richblack-800">
                        Your swiss Knife For
                        <HighlightText text={" learning any language"} />
                    </div>
                </AnimatedSection>

                <AnimatedSection animation="fadeUp" delay={100}>
                    <div className="text-center text-richblack-600 mx-auto text-base mx-auto font-medium">
                        Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, <br />progress
                        tracking, custom schedule and more.
                    </div>
                </AnimatedSection>

                <AnimatedSection animation="scale" delay={200} className="flex items-center justify-center mt-5">
                    <img src={know} alt="" className="object-contain -mr-28 hover:scale-105 transition-transform duration-300" />
                    <img src={compare} alt="" className="object-contain -mr-36 hover:scale-105 transition-transform duration-300 z-10" />
                    <img src={plan} alt="" className="object-contain hover:scale-105 transition-transform duration-300" />
                </AnimatedSection>
            </div>

            <AnimatedSection animation="fadeUp" delay={300} className="mt-8 mb-5">
                <Link to={token ? "/dashboard/enrolled-courses" : "/signup"}>
                    <div className="text-center text-[13px] px-4 py-2 rounded-md font-bold bg-yellow-50 text-black hover:scale-95 transition-all duration-200 w-fit mx-auto">
                        Get Started
                    </div>
                </Link>
            </AnimatedSection>
        </>
    );
};

export default LearningLanguagesection;