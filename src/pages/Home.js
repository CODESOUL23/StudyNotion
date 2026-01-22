import React, { useState } from 'react';
import {FaArrowRight} from "react-icons/fa";
import {Link} from "react-router-dom";
import { useSelector } from 'react-redux';
import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import LearningLanguagesection from "../components/core/HomePage/LearningLanguagesection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import Footer from "../components/common/Footer";
import ReviewMarquee from "../components/common/ReviewMarquee";
import AnimatedSection from "../components/common/AnimatedSection";
import { ACCOUNT_TYPE } from "../utils/constants";


const Home = () => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const [showInstructorModal, setShowInstructorModal] = useState(false);
    
    // Check if user is already an instructor
    const isInstructor = user?.accountType === ACCOUNT_TYPE.INSTRUCTOR;

    const handleBecomeInstructor = (e) => {
        if (token && isInstructor) {
            e.preventDefault();
            setShowInstructorModal(true);
        }
    };
    
    return (
        <div className="">
            {/* Instructor Modal */}
            {showInstructorModal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-11/12 max-w-[420px] rounded-2xl border border-richblack-600 bg-richblack-800 p-8 shadow-2xl shadow-black/50">
                        <p className="text-2xl font-bold text-richblack-5 text-center mb-4">
                            🎓 You're Already an Instructor!
                        </p>
                        <p className="text-richblack-200 text-center mb-6 leading-relaxed">
                            You already have an instructor account. Start creating amazing courses and share your knowledge with students!
                        </p>
                        <div className="flex flex-col gap-3">
                            <Link 
                                to="/dashboard/my-courses"
                                className="w-full rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-25 py-3 text-center font-semibold text-richblack-900 hover:shadow-lg hover:shadow-yellow-50/25 transition-all"
                            >
                                Go to My Courses
                            </Link>
                            <Link 
                                to="/dashboard/add-course"
                                className="w-full rounded-lg bg-richblack-700 py-3 text-center font-semibold text-richblack-5 hover:bg-richblack-600 transition-all border border-richblack-600"
                            >
                                Create New Course
                            </Link>
                            <button
                                onClick={() => setShowInstructorModal(false)}
                                className="w-full rounded-lg border border-richblack-600 py-3 text-center font-semibold text-richblack-300 hover:bg-richblack-700 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/*Section-1*/}
            <div className="bg-richblack-900 relative mx-auto flex flex-col w-[100%] items-center text-white justify-between z-20 overflow-visible">
                <AnimatedSection animation="fadeUp" delay={0}>
                    <Link 
                        to={token ? (isInstructor ? "#" : "/signup") : "/signup"}
                        onClick={handleBecomeInstructor}
                    >
                        <div className="group mt-16 p-3 px-6 mx-auto rounded-full bg-richblack-800 border border-richblack-700
                            font-bold text-richblack-200 transition-all duration-300 hover:scale-105 hover:bg-richblack-700 hover:border-richblack-500 hover:shadow-lg hover:shadow-yellow-50/10">
                            <div className="flex flex-row justify-center items-center gap-2">
                                <p className="group-hover:text-yellow-50 transition-colors">Become an Instructor</p>
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform"/>
                            </div>
                        </div>
                    </Link>
                </AnimatedSection>

                <AnimatedSection animation="fadeUp" delay={100}>
                    <div className="text-4xl font-semibold text-center mt-10 mb-8">
                        Empower Your Future With
                        <HighlightText text={"Coding Skills"}></HighlightText>
                    </div>
                </AnimatedSection>

                <AnimatedSection animation="fadeUp" delay={200}>
                    <div className="mt-4 w-[90%] mx-auto text-center text-lg font-bold text-richblack-300">
                        With our online coding courses, you can learn at your own pace, from anywhere in the world,
                        and get access to a wealth of resources, <br/>including hands-on projects, quizzes,
                        and personalized feedback from instructors.
                    </div>
                </AnimatedSection>

                <AnimatedSection animation="fadeUp" delay={300}>
                    <div className="flex flex-row gap-7 mt-8">
                        <CTAButton active={true} linkto="/signup" loggedInLink="/about" authRequired={false}>
                            Learn More
                        </CTAButton>
                        <CTAButton active={false} linkto="/book-demo">
                            Book A Demo
                        </CTAButton>
                    </div>
                </AnimatedSection>

                <AnimatedSection animation="scale" delay={400} className="mx-3 my-12 w-[75%] shadow-[12px_12px_rgba(255,_255,_255,_0.8)]">
                    <video muted loop autoPlay>
                        <source src={Banner} type="video/mp4"/>
                    </video>
                </AnimatedSection>

                {/*Code Section-1*/}
                <div>
                    <AnimatedSection animation="fadeLeft" delay={0}>
                        <CodeBlocks 
                            position="lg:flex-row"
                            heading={
                                <div className="text-4xl font-semibold">
                                    Unlock Your
                                    <HighlightText text="Coding Potential " />
                                    with our online courses
                                </div>
                            }
                            subheading="Our courses are designed and built to help you learn coding from scratch and build a solid foundation."
                            ctabtn1={{
                                active: true,
                                linkto: "/signup",
                                loggedInLink: "/dashboard/enrolled-courses",
                                btnText: "Try it yourself"
                            }}
                            ctabtn2={{
                                active: false,
                                linkto: "/signup",
                                loggedInLink: "/about",
                                btnText: "Learn More"
                            }}
                            codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n<linkrel="stylesheet"href="styles.css"/>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav><a href="one/">One</a>\n<a href="two/">Two</a>\n<a href="three/">Three</a></nav>`}
                            codeColor="bg-gradient-to-r from-white to-yellow-50 bg-clip-text text-transparent"/>
                    </AnimatedSection>

                    <AnimatedSection animation="fadeRight" delay={0}>
                        <CodeBlocks
                            position="lg:flex-row-reverse"
                            heading={
                                <div className="text-4xl font-semibold">
                                    Start
                                    <HighlightText text="Coding" />
                                    <br/>
                                    <HighlightText text="in Seconds " />

                                </div>
                            }
                            subheading="Our courses are designed and built to help you learn coding from scratch and build a solid foundation."
                            ctabtn1={{
                                active: true,
                                linkto: "/signup",
                                loggedInLink: "/dashboard/enrolled-courses",
                                btnText: "Try it yourself"
                            }}
                            ctabtn2={{
                                active: false,
                                linkto: "/signup",
                                loggedInLink: "/about",
                                btnText: "Learn More"
                            }}
                            codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n<linkrel="stylesheet"href="styles.css"/>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav><a href="one/">One</a>\n<a href="two/">Two</a>\n<a href="three/">Three</a></nav>`}

                            codeColor="bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent"/>
                    </AnimatedSection>
                </div>

                <AnimatedSection animation="fadeUp" delay={0}>
                    <ExploreMore></ExploreMore>
                </AnimatedSection>

            </div>

            {/*Section-2 - Mesh Background*/}
            <div className="w-[100%] relative z-10" style={{marginTop: '-140px'}}>
                {/* The cards from ExploreMore will visually overlap here */}
                <div className="homepage_bg h-[500px] relative">
                    <div className="w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto ">
                        <div className="h-[330px]"></div>
                        <AnimatedSection animation="fadeUp" delay={0}>
                            <div className="flex gap-7 text-white">
                                <CTAButton active={true} linkto="/signup" loggedInLink="/catalog/python">
                                    <div className="flex items-center gap-2">
                                        Explore Full Catalogue
                                        <FaArrowRight></FaArrowRight>
                                    </div>
                                </CTAButton>
                                <CTAButton active={false} linkto="/signup" loggedInLink="/about">
                                    <div className="flex items-center gap-2">
                                        Learn More
                                        <FaArrowRight></FaArrowRight>
                                    </div>
                                </CTAButton>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </div>

            {/*Section-2 Content - White Background*/}
            <div className="w-[100%] bg-white h-[100%] relative">
                <div className="mx-auto w-11/12 flex flex-col items-center justify-between gap-7 py-[80px]">
                    <AnimatedSection animation="fadeUp" delay={0} className="flex gap-5 justify-center w-full">
                        <div className="text-3xl font-semibold w-[45%] text-richblack-800">
                            Get the Skills you need a for a
                            <span className="bg-gradient-to-r from-caribbeangreen-500 to-caribbeangreen-200 bg-clip-text text-transparent font-bold">
                                {" "}Job <br/> that is in demand.
                            </span>
                        </div>
                        <div className="flex flex-col gap-10 justify-center w-[40%] items-start">
                            <div className="text-[16px] text-richblack-600">
                                The modern StudyNotion is the dictates its own terms.
                                Today, to be a competitive specialist requires more than professional skills.
                            </div>
                            <CTAButton active={true} linkto="/signup" loggedInLink="/about">
                                <div className="flex items-center gap-2">
                                    Learn More
                                </div>
                            </CTAButton>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection animation="fadeUp" delay={100}>
                        <TimelineSection></TimelineSection>
                    </AnimatedSection>
                    
                    <AnimatedSection animation="fadeUp" delay={0}>
                        <LearningLanguagesection></LearningLanguagesection>
                    </AnimatedSection>
                </div>
            </div>
            {/*Section -3*/}
            <div className="w-full mt-20 mx-auto flex-col items-center justify-between gap-8
            first-letter bg-richblack-900 text-white">

                <AnimatedSection animation="fadeUp" delay={0}>
                    <InstructorSection></InstructorSection>
                </AnimatedSection>

                {/* Reviews Section Header */}
                <AnimatedSection animation="scale" delay={0} className="flex justify-center mt-16 mb-4">
                    <div className="relative group">
                        {/* Gradient glow effect behind */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-50 via-caribbeangreen-200 to-pink-200 rounded-xl opacity-10 blur-md group-hover:opacity-20 transition-opacity duration-500"></div>
                        
                        {/* Main box */}
                        <div className="relative px-8 py-4 rounded-xl bg-gradient-to-r from-richblack-800 via-richblack-700 to-richblack-800 border border-richblack-600 group-hover:border-yellow-50/20 transition-all duration-500">
                            {/* Inner gradient overlay */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-50/[0.02] via-transparent to-caribbeangreen-200/[0.02]"></div>
                            
                            {/* Decorative elements */}
                            <div className="absolute -top-1 left-1/4 w-12 h-[2px] bg-gradient-to-r from-transparent via-yellow-50/50 to-transparent"></div>
                            <div className="absolute -bottom-1 right-1/4 w-12 h-[2px] bg-gradient-to-r from-transparent via-caribbeangreen-200/50 to-transparent"></div>
                            
                            <h2 className="relative text-center text-3xl md:text-4xl font-bold text-richblack-5">
                                Reviews From Our Learners
                            </h2>
                        </div>
                    </div>
                </AnimatedSection>
                
                <AnimatedSection animation="fadeUp" delay={100}>
                    <ReviewMarquee />
                </AnimatedSection>

            </div>
            {/*Footer Section*/}
            <Footer></Footer>
        </div>
    );
};

export default Home;
