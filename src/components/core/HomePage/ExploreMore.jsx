import React, {useState} from 'react';
import {HomePageExplore} from "../../../data/homepage-explore";
import HighlightText from "./HighlightText";
import CourseCard from "./CourseCard";

const tabsName = [
    "Free" ,
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths"
];

const ExploreMore = () => {

    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCards, setCurrentCards] = useState(HomePageExplore[0].courses[0]);

    //Ek aisa function banao jo hamare tabs aur courses ko change kar paaye
    const setMyCards = (value) =>{
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag===value);
        setCourses(result[0].courses);
        setCurrentCards(result[0].courses[0]);
    }

    return (
        <div className="flex flex-col items-center">
            <div className="text-4xl font-semibold text-center">
                Unlock the
                <HighlightText text={"Power of Code"}></HighlightText>
            </div>

            <p className="text-center text-richblack-300 text-lg font-medium mt-3">
                Learn to Build Anything You Can Imagine
            </p>

            <div className="flex flex-row gap-5 mx-auto w-max rounded-full bg-richblack-800 mt-10 mb-10 border border-richblack-700 px-1 py-1 relative z-10">
                {
                    tabsName.map((tab, index) => {
                        return (
                            <div className={`text-[16px] flex gap-3 items-center
                            ${currentTab === tab ? 
                                "bg-richblack-900 text-richblack-5 font-medium"
                            : "text-richblack-200" } rounded-full transition-all duration-200 cursor-pointer
                            hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2`}
                            key={index}
                            onClick={() => setMyCards(tab)}>
                                {tab}
                            </div>
                        )
                    })
                }
            </div>

            {/* Course Cards - positioned to overlap into next section */}
            <div className="hidden lg:flex justify-center gap-9 relative z-50 mt-8 mb-[-140px]">
                {
                    courses.map((course, index) => {
                        return(
                            <CourseCard
                                key={index}
                                cardData={course}
                                currentCard={currentCards}
                                setCurrentCards={setCurrentCards}
                            />
                        )
                    })
                }
            </div>
            
            {/* Mobile view - cards stacked normally */}
            <div className="flex lg:hidden flex-col gap-5 mt-5 mb-10">
                {
                    courses.map((course, index) => {
                        return(
                            <CourseCard
                                key={index}
                                cardData={course}
                                currentCard={currentCards}
                                setCurrentCards={setCurrentCards}
                            />
                        )
                    })
                }
            </div>
            
        </div>
    );
};

export default ExploreMore;
