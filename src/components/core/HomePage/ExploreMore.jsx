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
        <div>
            <div className="text-4xl font-semibold text-center">
                Unlock the
                <HighlightText text={"Power of Code"}></HighlightText>
            </div>

            <p className="text-center text-richblack-300 text-lg font-medium mt-3">
                Learn to Build Anything You Can Imagine
            </p>

            <div className="flex rounded-full bg-richblack-800 mt-10 mb-5 border-richblack-100">
                {
                    tabsName.map((tab, index) => {
                        return (
                            <div className={`text-[16px] flex gap-3 items-center
                            ${currentTab === tab ? 
                                "bg-richblack-900 text-richblack-5 font-medium"
                            : "text-richblack-200" } rounded-full transition-all duration-200 cursor-pointer
                            hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2 m-[5px]`}
                            key={index}
                            onClick={() => setMyCards(tab)}>
                                {tab}
                            </div>
                        )
                    })
                }
            </div>

            <div className="flex w-full lg:h-[150px] justify-center mt-24">

                {/*Course Card ka Group*/}
                <div className="flex absolute justify-center gap-6 z-10">
                    {
                        courses.map((course , index) =>{
                            return(
                                <CourseCard
                                key={index}
                                cardData = {course}
                                currentCard={currentCards}
                                setCurrentCards={setCurrentCards}>
                                </CourseCard>
                            )
                        })
                    }
                </div>

            </div>
        </div>
    );
};

export default ExploreMore;
