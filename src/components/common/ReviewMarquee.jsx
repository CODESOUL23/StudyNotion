import React, { useEffect, useState } from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { apiConnector } from "../../services/apiconnector";
import { ratingsEndpoints } from "../../services/apis";

// Sample reviews to show when no reviews exist in database
const sampleReviews = [
  {
    user: { firstName: "Rahul", lastName: "Sharma", image: null },
    course: { courseName: "Complete Web Development" },
    review: "This course transformed my career! The instructor explains concepts so clearly. Highly recommended for beginners.",
    rating: 5,
  },
  {
    user: { firstName: "Priya", lastName: "Patel", image: null },
    course: { courseName: "React Mastery" },
    review: "Best React course I've taken. The projects are practical and helped me land my dream job.",
    rating: 5,
  },
  {
    user: { firstName: "Amit", lastName: "Kumar", image: null },
    course: { courseName: "Data Structures & Algorithms" },
    review: "Excellent explanation of complex topics. The practice problems really helped me crack interviews.",
    rating: 4,
  },
  {
    user: { firstName: "Sneha", lastName: "Reddy", image: null },
    course: { courseName: "Python for Beginners" },
    review: "Started with zero coding knowledge and now I can build my own projects. Amazing course!",
    rating: 5,
  },
  {
    user: { firstName: "Vikram", lastName: "Singh", image: null },
    course: { courseName: "Machine Learning Basics" },
    review: "The instructor makes ML concepts so easy to understand. Great course for aspiring data scientists.",
    rating: 4,
  },
  {
    user: { firstName: "Ananya", lastName: "Gupta", image: null },
    course: { courseName: "Full Stack Development" },
    review: "Comprehensive curriculum covering both frontend and backend. Worth every penny!",
    rating: 5,
  },
  {
    user: { firstName: "Karthik", lastName: "Nair", image: null },
    course: { courseName: "JavaScript Advanced" },
    review: "Finally understood closures, promises, and async/await properly. This course is a gem!",
    rating: 5,
  },
  {
    user: { firstName: "Meera", lastName: "Iyer", image: null },
    course: { courseName: "UI/UX Design" },
    review: "Great balance of theory and practical projects. My design skills improved tremendously.",
    rating: 4,
  },
];

function ReviewMarquee() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        );
        if (data?.success && data?.data?.length > 0) {
          setReviews(data.data);
        } else {
          // Use sample reviews if no reviews in database
          setReviews(sampleReviews);
        }
      } catch (error) {
        console.log("Using sample reviews");
        setReviews(sampleReviews);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-50"></div>
      </div>
    );
  }

  // Double the reviews for seamless infinite scroll
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <div className="w-full py-12 overflow-hidden bg-richblack-900">
      {/* First Row - Left to Right */}
      <div className="relative mb-6">
        <div className="flex animate-marquee-left">
          {duplicatedReviews.map((review, index) => (
            <ReviewCard key={`left-${index}`} review={review} />
          ))}
        </div>
      </div>

      {/* Second Row - Right to Left */}
      <div className="relative">
        <div className="flex animate-marquee-right">
          {duplicatedReviews.reverse().map((review, index) => (
            <ReviewCard key={`right-${index}`} review={review} />
          ))}
        </div>
      </div>

      {/* CSS for marquee animation */}
      <style jsx="true">{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .animate-marquee-left {
          animation: marquee-left 40s linear infinite;
        }
        
        .animate-marquee-right {
          animation: marquee-right 40s linear infinite;
        }
        
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

// Individual Review Card Component
function ReviewCard({ review }) {
  const truncateWords = 20;
  const reviewText = review?.review || "";
  const truncatedReview =
    reviewText.split(" ").length > truncateWords
      ? `${reviewText.split(" ").slice(0, truncateWords).join(" ")}...`
      : reviewText;

  return (
    <div className="flex-shrink-0 w-[350px] mx-3 bg-richblack-800 rounded-lg p-5 border border-richblack-700 hover:border-richblack-600 transition-all duration-300 hover:scale-[1.02]">
      {/* Quote Icon */}
      <FaQuoteLeft className="text-yellow-50 text-xl mb-3 opacity-60" />
      
      {/* Review Text */}
      <p className="text-richblack-100 text-sm leading-relaxed mb-4 min-h-[60px]">
        {truncatedReview}
      </p>

      {/* User Info and Rating */}
      <div className="flex items-center justify-between border-t border-richblack-700 pt-4">
        <div className="flex items-center gap-3">
          <img
            src={
              review?.user?.image
                ? review.user.image
                : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
            }
            alt={`${review?.user?.firstName}`}
            className="h-10 w-10 rounded-full object-cover border-2 border-yellow-50"
          />
          <div>
            <h4 className="font-semibold text-richblack-5 text-sm">
              {`${review?.user?.firstName} ${review?.user?.lastName}`}
            </h4>
            <p className="text-xs text-richblack-400">
              {review?.course?.courseName}
            </p>
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-1 bg-richblack-700 px-2 py-1 rounded">
          <span className="text-yellow-50 font-semibold text-sm">
            {review?.rating?.toFixed(1)}
          </span>
          <FaStar className="text-yellow-50 text-sm" />
        </div>
      </div>
    </div>
  );
}

export default ReviewMarquee;
