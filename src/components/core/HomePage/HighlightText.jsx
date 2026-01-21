import React from 'react';

const HighlightText = ({text}) => {
    return (
            <span className="font-bold text-blue-100 bg-gradient-to-b from-[richblue-900] to-[black]">
                {" "}
                {text}
            </span>
    );
};

export default HighlightText;
