import React from 'react';
import { MdPeopleAlt } from "react-icons/md";
import { LuNetwork } from "react-icons/lu";

const CourseCard = ({key , cardData , currentCard , setCurrentCards}) => {
    return (
        <div className={`flex flex-col gap-3 w-[300px] min-w-[280px] h-[280px] p-4 text-md ${cardData === currentCard ? "bg-white text-richblack-800 shadow-[10px_10px_rgba(255,_214,_10,_1)] " 
            : "bg-richblack-800 text-white"} transition-all duration-200 cursor-pointer hover:scale-[1.02]`}
        onClick={()=>{setCurrentCards(cardData)}}
        key={key}>

            <h1 className="px-2 text-lg font-bold">{cardData.heading}</h1>
            <p className="px-2 text-sm leading-relaxed flex-grow">{cardData.description}</p>
            <div className="flex justify-between px-3 items-end mt-auto pt-4 border-t border-dashed border-richblack-400">
                <div className="flex items-center gap-2">
                    <MdPeopleAlt />
                    {cardData.level}
                </div>
                <div className="flex items-center gap-2">
                    <LuNetwork></LuNetwork>
                    <p>{cardData.lessionNumber}</p>
                </div>
            </div>

        </div>
    );
};

export default CourseCard;
