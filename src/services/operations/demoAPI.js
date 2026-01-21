import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Demo endpoints
export const demoEndpoints = {
    BOOK_DEMO_API: BASE_URL + "/user/book-demo",
    GET_DEMO_COURSES_API: BASE_URL + "/user/demo-courses",
    CHECK_DEMO_STATUS_API: BASE_URL + "/user/check-demo-status",
    GET_USER_DEMOS_API: BASE_URL + "/user/user-demos",
};

// Book a demo class
export const bookDemo = async (data) => {
    const toastId = toast.loading("Booking your demo...");
    let result = null;
    try {
        const response = await apiConnector("POST", demoEndpoints.BOOK_DEMO_API, data);
        
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        
        result = response.data;
        toast.success("Demo booked successfully! Check your email.");
    } catch (error) {
        console.error("BOOK_DEMO_API ERROR:", error);
        toast.error(error.response?.data?.message || "Could not book demo");
    }
    toast.dismiss(toastId);
    return result;
};

// Get all available demo courses
export const getDemoCourses = async () => {
    let result = [];
    try {
        const response = await apiConnector("GET", demoEndpoints.GET_DEMO_COURSES_API);
        
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        
        result = response.data.data;
    } catch (error) {
        console.error("GET_DEMO_COURSES_API ERROR:", error);
        toast.error("Could not fetch demo courses");
    }
    return result;
};

// Check demo status
export const checkDemoStatus = async (email, accessCode) => {
    let result = null;
    try {
        const response = await apiConnector("POST", demoEndpoints.CHECK_DEMO_STATUS_API, {
            email,
            accessCode,
        });
        
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        
        result = response.data;
    } catch (error) {
        console.error("CHECK_DEMO_STATUS_API ERROR:", error);
        toast.error(error.response?.data?.message || "Could not check demo status");
    }
    return result;
};

// Get user's demo enrollments
export const getUserDemos = async (email) => {
    let result = [];
    try {
        const response = await apiConnector("GET", `${demoEndpoints.GET_USER_DEMOS_API}?email=${email}`);
        
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        
        result = response.data.data;
    } catch (error) {
        console.error("GET_USER_DEMOS_API ERROR:", error);
    }
    return result;
};
