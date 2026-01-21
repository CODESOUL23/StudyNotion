import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { bookDemo, getDemoCourses, getUserDemos } from '../services/operations/demoAPI';
import Footer from '../components/common/Footer';
import CountryCode from '../data/countrycode.json';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const BookDemo = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [demoData, setDemoData] = useState(null);
    const [checkingExisting, setCheckingExisting] = useState(true);

    const { user } = useSelector((state) => state.profile);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    // Check if user already has demo enrollments
    useEffect(() => {
        const checkExistingDemos = async () => {
            // Check from localStorage first
            const savedDemo = localStorage.getItem('studynotion_demo');
            if (savedDemo) {
                try {
                    const parsed = JSON.parse(savedDemo);
                    // Check if demo is still valid (not expired)
                    if (new Date(parsed.expiryDate) > new Date()) {
                        setDemoData(parsed);
                        setSubmitted(true);
                    } else {
                        localStorage.removeItem('studynotion_demo');
                    }
                } catch (e) {
                    localStorage.removeItem('studynotion_demo');
                }
            }

            // If user is logged in, check from API
            if (user?.email) {
                try {
                    const demos = await getUserDemos(user.email);
                    const activeDemos = demos.filter(d => 
                        d.status === "Active" && new Date(d.expiryDate) > new Date()
                    );
                    if (activeDemos.length > 0) {
                        // Show the most recent demo
                        const latestDemo = activeDemos[0];
                        setDemoData({
                            accessCode: latestDemo.accessCode,
                            courseName: latestDemo.course?.courseName || "Your Course",
                            expiryDate: new Date(latestDemo.expiryDate).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })
                        });
                        setSubmitted(true);
                    }
                } catch (error) {
                    console.error("Error checking existing demos:", error);
                }
            }
            setCheckingExisting(false);
        };

        checkExistingDemos();
    }, [user]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const result = await getDemoCourses();
                if (result && result.length > 0) {
                    setCourses(result);
                    setSelectedCourse(result[0]._id);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const onSubmit = async (data) => {
        if (!selectedCourse) {
            toast.error("Please select a course");
            return;
        }

        setSubmitting(true);
        try {
            const result = await bookDemo({
                ...data,
                phone: `${data.countryCode}-${data.phone}`,
                courseId: selectedCourse,
            });

            if (result.success) {
                // Save to localStorage for persistence
                localStorage.setItem('studynotion_demo', JSON.stringify(result.data));
                setDemoData(result.data);
                setSubmitted(true);
                reset();
                toast.success("Demo booked successfully!");
            }
        } catch (error) {
            console.error("Error booking demo:", error);
        } finally {
            setSubmitting(false);
        }
    };

    // Loading state while checking existing demos
    if (checkingExisting) {
        return (
            <div className="min-h-screen bg-richblack-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-caribbeangreen-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-richblack-300">Loading...</p>
                </div>
            </div>
        );
    }

    // Success/Already Registered State
    if (submitted && demoData) {
        return (
            <div className="min-h-screen bg-richblack-900">
                <div className="w-11/12 max-w-3xl mx-auto py-16 md:py-24">
                    <div className="bg-richblack-800 rounded-2xl p-8 md:p-10 border border-richblack-700">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-caribbeangreen-400 rounded-full flex items-center justify-center mx-auto mb-5">
                                <svg className="w-8 h-8 text-richblack-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            
                            <h1 className="text-2xl md:text-3xl font-semibold text-richblack-5 mb-3">
                                You're All Set!
                            </h1>
                            
                            <p className="text-richblack-300">
                                Your demo access is active. We've sent the details to your email.
                            </p>
                        </div>

                        {/* Access Code Card */}
                        <div className="bg-richblack-700 rounded-xl p-5 mb-6">
                            <p className="text-richblack-400 text-sm mb-1">Your Access Code</p>
                            <p className="text-2xl font-mono font-bold text-caribbeangreen-200 tracking-widest">
                                {demoData.accessCode}
                            </p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid sm:grid-cols-2 gap-4 mb-8">
                            <div className="bg-richblack-700/50 rounded-lg p-4">
                                <p className="text-richblack-400 text-sm mb-1">Course</p>
                                <p className="text-richblack-5 font-medium">{demoData.courseName}</p>
                            </div>
                            <div className="bg-richblack-700/50 rounded-lg p-4">
                                <p className="text-richblack-400 text-sm mb-1">Valid Until</p>
                                <p className="text-richblack-5 font-medium">{demoData.expiryDate}</p>
                            </div>
                        </div>

                        {/* Info Note */}
                        <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4 mb-8">
                            <p className="text-yellow-200 text-sm">
                                <span className="font-medium">Note:</span> Your 3-day trial gives you full access to course content. 
                                After it expires, you can purchase the course to continue learning.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => {
                                    localStorage.removeItem('studynotion_demo');
                                    setSubmitted(false);
                                    setDemoData(null);
                                }}
                                className="flex-1 px-5 py-3 bg-richblack-700 text-richblack-5 rounded-lg font-medium hover:bg-richblack-600 transition-colors"
                            >
                                Try Another Course
                            </button>
                            <Link
                                to="/"
                                className="flex-1 px-5 py-3 bg-caribbeangreen-400 text-richblack-900 rounded-lg font-medium hover:bg-caribbeangreen-300 transition-colors text-center"
                            >
                                Explore Courses
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-richblack-900">
            {/* Hero Section */}
            <div className="bg-richblack-800 py-12 md:py-16 border-b border-richblack-700">
                <div className="w-11/12 max-w-5xl mx-auto text-center">
                    <span className="inline-block px-3 py-1 bg-yellow-900/30 text-yellow-200 text-sm font-medium rounded-full mb-4">
                        Free Trial
                    </span>
                    
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-richblack-5 mb-4">
                        Try Before You Buy
                    </h1>
                    
                    <p className="text-richblack-300 text-lg max-w-2xl mx-auto">
                        Get 3 days of free access to any course. No payment required, 
                        no strings attached.
                    </p>

                    {/* Simple Feature List */}
                    <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
                        <div className="flex items-center gap-2 text-richblack-300">
                            <span className="w-5 h-5 bg-caribbeangreen-400 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-richblack-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </span>
                            Full course access
                        </div>
                        <div className="flex items-center gap-2 text-richblack-300">
                            <span className="w-5 h-5 bg-caribbeangreen-400 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-richblack-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </span>
                            No credit card needed
                        </div>
                        <div className="flex items-center gap-2 text-richblack-300">
                            <span className="w-5 h-5 bg-caribbeangreen-400 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-richblack-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </span>
                            Cancel anytime
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-11/12 max-w-5xl mx-auto py-12">
                <div className="grid lg:grid-cols-2 gap-10">
                    {/* Course Selection */}
                    <div>
                        <h2 className="text-xl font-semibold text-richblack-5 mb-5">
                            Choose a course
                        </h2>

                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-richblack-800 rounded-lg p-4 animate-pulse">
                                        <div className="flex gap-4">
                                            <div className="w-20 h-16 bg-richblack-700 rounded"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-richblack-700 rounded w-3/4 mb-2"></div>
                                                <div className="h-3 bg-richblack-700 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : courses.length === 0 ? (
                            <div className="bg-richblack-800 rounded-lg p-6 text-center">
                                <p className="text-richblack-400">No courses available right now.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                                {courses.map((course) => (
                                    <div
                                        key={course._id}
                                        onClick={() => setSelectedCourse(course._id)}
                                        className={`bg-richblack-800 rounded-lg p-4 cursor-pointer transition-all border ${
                                            selectedCourse === course._id
                                                ? 'border-caribbeangreen-400 bg-richblack-700'
                                                : 'border-richblack-700 hover:border-richblack-600'
                                        }`}
                                    >
                                        <div className="flex gap-4">
                                            <img
                                                src={course.thumbnail}
                                                alt={course.courseName}
                                                className="w-20 h-16 object-cover rounded"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-richblack-5 font-medium mb-1 truncate">
                                                    {course.courseName}
                                                </h3>
                                                <p className="text-richblack-400 text-sm line-clamp-1">
                                                    {course.courseDescription}
                                                </p>
                                                {course.instructor && (
                                                    <p className="text-richblack-500 text-xs mt-1">
                                                        {course.instructor.firstName} {course.instructor.lastName}
                                                    </p>
                                                )}
                                            </div>
                                            {selectedCourse === course._id && (
                                                <div className="flex items-center">
                                                    <span className="w-5 h-5 bg-caribbeangreen-400 rounded-full flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-richblack-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Booking Form */}
                    <div>
                        <h2 className="text-xl font-semibold text-richblack-5 mb-5">
                            Your details
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="bg-richblack-800 rounded-lg p-6 border border-richblack-700">
                            <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                {/* First Name */}
                                <div>
                                    <label className="block text-richblack-5 text-sm mb-1.5">
                                        First Name <span className="text-pink-200">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="John"
                                        defaultValue={user?.firstName || ""}
                                        {...register("firstName", { required: "Required" })}
                                        className="w-full bg-richblack-700 text-richblack-5 rounded-lg px-4 py-2.5 border border-richblack-600 focus:border-caribbeangreen-400 focus:outline-none text-sm"
                                    />
                                    {errors.firstName && (
                                        <p className="text-pink-200 text-xs mt-1">{errors.firstName.message}</p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block text-richblack-5 text-sm mb-1.5">
                                        Last Name <span className="text-pink-200">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Doe"
                                        defaultValue={user?.lastName || ""}
                                        {...register("lastName", { required: "Required" })}
                                        className="w-full bg-richblack-700 text-richblack-5 rounded-lg px-4 py-2.5 border border-richblack-600 focus:border-caribbeangreen-400 focus:outline-none text-sm"
                                    />
                                    {errors.lastName && (
                                        <p className="text-pink-200 text-xs mt-1">{errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="mb-4">
                                <label className="block text-richblack-5 text-sm mb-1.5">
                                    Email <span className="text-pink-200">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    defaultValue={user?.email || ""}
                                    {...register("email", {
                                        required: "Required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email",
                                        },
                                    })}
                                    className="w-full bg-richblack-700 text-richblack-5 rounded-lg px-4 py-2.5 border border-richblack-600 focus:border-caribbeangreen-400 focus:outline-none text-sm"
                                />
                                {errors.email && (
                                    <p className="text-pink-200 text-xs mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div className="mb-4">
                                <label className="block text-richblack-5 text-sm mb-1.5">
                                    Phone <span className="text-pink-200">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <select
                                        {...register("countryCode", { required: true })}
                                        defaultValue="+91"
                                        className="bg-richblack-700 text-richblack-5 rounded-lg px-3 py-2.5 border border-richblack-600 focus:border-caribbeangreen-400 focus:outline-none text-sm w-20"
                                    >
                                        {CountryCode.map((code, index) => (
                                            <option key={index} value={code.code}>
                                                {code.code}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="tel"
                                        placeholder="9876543210"
                                        {...register("phone", {
                                            required: "Required",
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: "Enter 10 digits",
                                            },
                                        })}
                                        className="flex-1 bg-richblack-700 text-richblack-5 rounded-lg px-4 py-2.5 border border-richblack-600 focus:border-caribbeangreen-400 focus:outline-none text-sm"
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="text-pink-200 text-xs mt-1">{errors.phone.message}</p>
                                )}
                            </div>

                            {/* Message (Optional) */}
                            <div className="mb-6">
                                <label className="block text-richblack-5 text-sm mb-1.5">
                                    Message <span className="text-richblack-400">(optional)</span>
                                </label>
                                <textarea
                                    rows="3"
                                    placeholder="Any specific topics you want to learn?"
                                    {...register("message")}
                                    className="w-full bg-richblack-700 text-richblack-5 rounded-lg px-4 py-2.5 border border-richblack-600 focus:border-caribbeangreen-400 focus:outline-none text-sm resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submitting || !selectedCourse}
                                className="w-full py-3 bg-yellow-50 text-richblack-900 font-semibold rounded-lg hover:bg-yellow-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-richblack-900 border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    "Start Free Trial"
                                )}
                            </button>

                            <p className="text-richblack-500 text-xs text-center mt-3">
                                We'll send your access details to your email
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            {/* Simple FAQ */}
            <div className="bg-richblack-800 py-12 border-t border-richblack-700">
                <div className="w-11/12 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-semibold text-richblack-5 text-center mb-8">
                        Common Questions
                    </h2>

                    <div className="space-y-4">
                        {[
                            {
                                q: "What happens after 3 days?",
                                a: "Your demo access expires and you can choose to purchase the full course. Your progress is saved."
                            },
                            {
                                q: "Do I need to add payment details?",
                                a: "No. The demo is completely free with no payment information required."
                            },
                            {
                                q: "What's included in the demo?",
                                a: "You get full access to all course videos, materials, and resources for 3 days."
                            },
                            {
                                q: "Can I try multiple courses?",
                                a: "Yes, you can try one course at a time. After your demo ends, you can try another course."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-richblack-700 rounded-lg p-5">
                                <h3 className="text-richblack-5 font-medium mb-2">{faq.q}</h3>
                                <p className="text-richblack-400 text-sm">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default BookDemo;
