import React from 'react';
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


const Home = () => {
    const { token } = useSelector((state) => state.auth);
    
    return (
        <div className="">
            {/*Section-1*/}
            <div className="  bg-richblack-900 relative mx-auto flex flex-col w-[100%] items-center text-white justify-between">
                <Link to={token ? "/dashboard/instructor" : "/signup"}>
                    <div className="mt-16 p-3 mx-auto rounded-full bg-richblack-800
                        font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-full hover:bg-richblack-900 hover:border-2">
                        <div className="flex flex-row justify-center items-center gap-1">
                            <p>Become an Instructor</p>
                            <FaArrowRight/>
                        </div>
                    </div>
                </Link>

                <div className="text-4xl font-semibold text-center mt-10 mb-8">
                    Empower Your Future With
                    <HighlightText text={"Coding Skills"}></HighlightText>
                </div>

                <div className="mt-4 w-[90%] text-center text-lg font-bold text-richblack-300">
                    With our online coding courses, you can learn at your own pace, from anywhere in the world,
                    and get access to a <br/>wealth of resources, including hands-on projects, quizzes,
                    and personalized feedback from instructors.
                </div>

                <div className="flex flex-row gap-7 mt-8">
                    <CTAButton active={true} linkto="/signup" loggedInLink="/about" authRequired={false}>
                        Learn More
                    </CTAButton>
                    <CTAButton active={false} linkto="/book-demo">
                        Book A Demo
                    </CTAButton>
                </div>

                <div className="mx-3 my-12 w-[75%] shadow-[12px_12px_rgba(255,_255,_255,_0.8)] ">
                    <video
                    muted loop autoPlay>
                        <source src={Banner} type="video/mp4"/>
                    </video>
                </div>

                {/*Code Section-1*/}
                <div>
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
                </div>

                <ExploreMore></ExploreMore>

            </div>

            {/*Section-2*/}
            <div className="w-[100%] bg-white h-[100%] relative ">
                <div className="homepage_bg h-[310px] relative">
                    <div className="w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto ">
                        <div className="h-[130px]"></div>
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
                    </div>
                </div>

                <div className="mx-auto w-11/12 flex flex-col items-center justify-between gap-7 mt-[100px]">
                    <div className="flex gap-5 justify-center">
                        <div className="text-3xl font-semibold w-[45%]">
                            Get the Skills you need a for a
                            <span className="bg-gradient-to-r from-blue-50 to-richblue-700 bg-clip-text text-transparent">
                                Job <br/> that is in demand.
                            </span>
                        </div>
                        <div className="flex flex-col gap-10 justify-center w-[40%] items-start">
                            <div className="text-[16px]">
                                The modern StudyNotion is the dictates its own terms.
                                Today, to be a competitive specialist requires more than professional skills.
                            </div>
                            <CTAButton active={true} linkto="/signup" loggedInLink="/about">
                                <div className="flex items-center gap-2">
                                    Learn More
                                </div>
                            </CTAButton>
                        </div>
                    </div>

                    <TimelineSection></TimelineSection>
                    <LearningLanguagesection></LearningLanguagesection>
                </div>
            </div>
            {/*Section -3*/}
            <div className="w-full mt-20 mx-auto flex-col items-center justify-between gap-8
            first-letter bg-richblack-900 text-white">

                <InstructorSection></InstructorSection>

                <h2 className="text-center text-4xl font-sans font-semibold mt-10">Reviews From Our Learners</h2>
                <ReviewMarquee />

            </div>
            {/*Footer Section*/}
            <Footer></Footer>
        </div>
    );
};

export default Home;
