import React, { useEffect, useState } from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { apiConnector } from "../../services/apiconnector";
import { ratingsEndpoints } from "../../services/apis";

// Sample reviews to show when reviews are insufficient
const sampleReviews = [
  {
    _id: "sample1",
    user: { firstName: "Rahul", lastName: "Sharma", image: null },
    course: { courseName: "Complete Web Development" },
    review: "This course transformed my career! The instructor explains concepts so clearly. Highly recommended for beginners.",
    rating: 5,
  },
  {
    _id: "sample2",
    user: { firstName: "Priya", lastName: "Patel", image: null },
    course: { courseName: "React Mastery" },
    review: "Best React course I've taken. The projects are practical and helped me land my dream job.",
    rating: 5,
  },
  {
    _id: "sample3",
    user: { firstName: "Amit", lastName: "Kumar", image: null },
    course: { courseName: "Data Structures & Algorithms" },
    review: "Excellent explanation of complex topics. The practice problems really helped me crack interviews.",
    rating: 4,
  },
  {
    _id: "sample4",
    user: { firstName: "Sneha", lastName: "Reddy", image: null },
    course: { courseName: "Python for Beginners" },
    review: "Started with zero coding knowledge and now I can build my own projects. Amazing course!",
    rating: 5,
  },
  {
    _id: "sample5",
    user: { firstName: "Vikram", lastName: "Singh", image: null },
    course: { courseName: "Machine Learning Basics" },
    review: "The instructor makes ML concepts so easy to understand. Great course for aspiring data scientists.",
    rating: 4,
  },
  {
    _id: "sample6",
    user: { firstName: "Ananya", lastName: "Gupta", image: null },
    course: { courseName: "Full Stack Development" },
    review: "Comprehensive curriculum covering both frontend and backend. Worth every penny!",
    rating: 5,
  },
  {
    _id: "sample7",
    user: { firstName: "Karthik", lastName: "Nair", image: null },
    course: { courseName: "JavaScript Advanced" },
    review: "Finally understood closures, promises, and async/await properly. This course is a gem!",
    rating: 5,
  },
  {
    _id: "sample8",
    user: { firstName: "Meera", lastName: "Iyer", image: null },
    course: { courseName: "UI/UX Design" },
    review: "Great balance of theory and practical projects. My design skills improved tremendously.",
    rating: 4,
  },
  {
    _id: "sample9",
    user: { firstName: "Arjun", lastName: "Verma", image: null },
    course: { courseName: "Node.js Backend" },
    review: "Perfect for understanding server-side development. The REST API section was incredibly detailed.",
    rating: 5,
  },
  {
    _id: "sample10",
    user: { firstName: "Divya", lastName: "Menon", image: null },
    course: { courseName: "MongoDB Masterclass" },
    review: "Learned database design from scratch. Now I can build complete full-stack applications!",
    rating: 5,
  },
  {
    _id: "sample11",
    user: { firstName: "Rohan", lastName: "Joshi", image: null },
    course: { courseName: "TypeScript Essentials" },
    review: "TypeScript finally clicked for me! The examples are practical and easy to follow.",
    rating: 4,
  },
  {
    _id: "sample12",
    user: { firstName: "Neha", lastName: "Agarwal", image: null },
    course: { courseName: "CSS & Tailwind Mastery" },
    review: "My UI designs look so much better now. The responsive design section was super helpful!",
    rating: 5,
  },
];

const MIN_REVIEWS_COUNT = 8; // Minimum reviews to display for a full look

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
        
        let finalReviews = [];
        
        if (data?.success && data?.data?.length > 0) {
          // Start with real reviews
          finalReviews = [...data.data];
          
          // If we have less than minimum, fill with sample reviews
          if (finalReviews.length < MIN_REVIEWS_COUNT) {
            const neededSamples = MIN_REVIEWS_COUNT - finalReviews.length;
            // Shuffle sample reviews and pick needed amount
            const shuffledSamples = [...sampleReviews].sort(() => Math.random() - 0.5);
            finalReviews = [...finalReviews, ...shuffledSamples.slice(0, neededSamples)];
          }
        } else {
          // No reviews in database, use all sample reviews
          finalReviews = sampleReviews;
        }
        
        setReviews(finalReviews);
      } catch (error) {
        console.log("Using sample reviews due to error");
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
    <div className="w-full py-16 overflow-hidden bg-gradient-to-b from-richblack-900 via-richblack-800 to-richblack-900 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-50 rounded-full opacity-[0.02] blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-caribbeangreen-200 rounded-full opacity-[0.02] blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-200 rounded-full opacity-[0.01] blur-3xl"></div>
      </div>

      {/* Section Header */}
      <div className="text-center mb-12 relative z-10">
        <p className="text-caribbeangreen-200 font-semibold text-sm tracking-wider uppercase mb-2">
          Testimonials
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-richblack-5 mb-3">
          What Our <span className="bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200 bg-clip-text text-transparent">Students Say</span>
        </h2>
        <p className="text-richblack-300 max-w-2xl mx-auto">
          Join thousands of successful learners who transformed their careers with our courses
        </p>
      </div>

      {/* First Row - Left to Right */}
      <div className="relative mb-8">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-richblack-900 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-richblack-900 to-transparent z-10 pointer-events-none"></div>
        
        <div className="flex animate-marquee-left">
          {duplicatedReviews.map((review, index) => (
            <ReviewCard key={`left-${index}`} review={review} />
          ))}
        </div>
      </div>

      {/* Second Row - Right to Left */}
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-richblack-900 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-richblack-900 to-transparent z-10 pointer-events-none"></div>
        
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
          animation: marquee-left 35s linear infinite;
        }
        
        .animate-marquee-right {
          animation: marquee-right 35s linear infinite;
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
  const truncateWords = 18;
  const reviewText = review?.review || "";
  const truncatedReview =
    reviewText.split(" ").length > truncateWords
      ? `${reviewText.split(" ").slice(0, truncateWords).join(" ")}...`
      : reviewText;

  // Generate gradient based on rating
  const getGradientClass = (rating) => {
    if (rating >= 5) return "from-yellow-500/20 to-transparent";
    if (rating >= 4) return "from-caribbeangreen-200/20 to-transparent";
    return "from-pink-200/20 to-transparent";
  };

  return (
    <div className="flex-shrink-0 w-[380px] mx-4 group">
      <div className={`relative bg-gradient-to-br ${getGradientClass(review?.rating)} p-[1px] rounded-2xl`}>
        <div className="bg-richblack-800 rounded-2xl p-6 h-full backdrop-blur-sm border border-richblack-700/50 hover:border-yellow-50/30 transition-all duration-500 hover:shadow-lg hover:shadow-yellow-50/5 group-hover:-translate-y-1">
          {/* Top section with quote and rating */}
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-gradient-to-br from-yellow-50/10 to-yellow-50/5 rounded-lg">
              <FaQuoteLeft className="text-yellow-50 text-lg" />
            </div>
            
            {/* Star Rating Badge */}
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-50/20 to-yellow-50/10 px-3 py-1.5 rounded-full border border-yellow-50/20">
              <FaStar className="text-yellow-50 text-xs" />
              <span className="text-yellow-50 font-bold text-sm">
                {review?.rating?.toFixed(1)}
              </span>
            </div>
          </div>
          
          {/* Review Text */}
          <p className="text-richblack-100 text-sm leading-relaxed mb-5 min-h-[72px] italic">
            "{truncatedReview}"
          </p>

          {/* User Info */}
          <div className="flex items-center gap-4 pt-4 border-t border-richblack-700/50">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-50 to-caribbeangreen-200 rounded-full opacity-30 blur-sm group-hover:opacity-50 transition-opacity"></div>
              <img
                src={
                  review?.user?.image
                    ? review.user.image
                    : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                }
                alt={`${review?.user?.firstName}`}
                className="relative h-12 w-12 rounded-full object-cover border-2 border-richblack-600 group-hover:border-yellow-50/50 transition-colors"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-richblack-5 text-base group-hover:text-yellow-50 transition-colors">
                {`${review?.user?.firstName} ${review?.user?.lastName}`}
              </h4>
              <p className="text-xs text-richblack-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-caribbeangreen-200 rounded-full"></span>
                {review?.course?.courseName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewMarquee;
