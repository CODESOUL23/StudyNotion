import React from 'react';
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelineImage from "../../../assets/Images/TimelineImage.png"

// Data to prepare the left box
const timeline = [
    {
        Logo : Logo1,
        heading : "Leadership",
        description : "Fully Committed to the success Company",
    },

    {
        Logo : Logo2,
        heading : "Leadership",
        description : "Fully Committed to the success Company",
    },

    {
        Logo : Logo3,
        heading : "Leadership",
        description : "Fully Committed to the success Company",
    },

    {
        Logo : Logo4,
        heading : "Leadership",
        description : "Fully Committed to the success Company",
    }
]

const TimelineSection = () => {
    return (
        <div>
            <div className="flex gap-15 items-center">
                {/*Left Vala Box*/}
                <div className="w-[45%] flex flex-col gap-6">
                    {
                        timeline.map((element, index) => {
                            return (
                                <div className="flex flex-row gap-6" key={index}>
                                    <div className="w-[50px] h-[50px] bg-white flex items-center">
                                        <img src={element.Logo}/>
                                    </div>
                                    <div>
                                        <h2 className="text-[18px]
                                        font-semibold">{element.heading}</h2>
                                        <p className="text-base">{element.description}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                {/*Right Vala Box*/}
                <div className="relative shadow-blue-200">
                    <img src={timelineImage} alt="TimeLineImage" className="rounded-sm"/>
                    <div className="absolute w-[70%] bg-caribbeangreen-700 flex justify-center text-white uppercase py-7 translate-x-[22%] translate-y-[-50%]">
                        <div className="flex gap-5 items-center border-r border-caribbeangreen-300 px-6">
                            <p className="text-3xl font-bold">10</p>
                            <p className="text-caribbeangreen-300 text-sm">Years of Experience</p>
                        </div>
                        <div className="flex gap-5 items-center px-7">
                            <p className="text-3xl font-bold">250</p>
                            <p className="text-caribbeangreen-300 text-sm">Types of Courses</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimelineSection;
