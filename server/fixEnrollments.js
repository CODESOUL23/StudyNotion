// Script to fix existing enrollments - converts string user IDs to ObjectIds
// Run this once: node fixEnrollments.js

const mongoose = require('mongoose');
require('dotenv').config();

const Course = require('./models/Course');

const fixEnrollments = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to database');

        // Find all courses with students enrolled
        const courses = await Course.find({ studentsEnrolled: { $exists: true, $ne: [] } });
        console.log(`Found ${courses.length} courses with enrollments`);

        for (const course of courses) {
            const originalEnrollments = course.studentsEnrolled;
            const fixedEnrollments = [];

            for (const studentId of originalEnrollments) {
                // Check if it's already an ObjectId or a string
                if (typeof studentId === 'string') {
                    // Convert string to ObjectId
                    fixedEnrollments.push(new mongoose.Types.ObjectId(studentId));
                    console.log(`Converting string ID: ${studentId} to ObjectId`);
                } else {
                    // Already an ObjectId, keep as is
                    fixedEnrollments.push(studentId);
                }
            }

            // Update the course with fixed enrollments
            await Course.findByIdAndUpdate(course._id, {
                studentsEnrolled: fixedEnrollments
            });
            console.log(`Fixed enrollments for course: ${course.courseName}`);
        }

        console.log('\n✅ All enrollments fixed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing enrollments:', error);
        process.exit(1);
    }
};

fixEnrollments();
