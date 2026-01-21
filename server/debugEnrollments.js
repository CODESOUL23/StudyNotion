// Debug script to check enrollment data
const mongoose = require('mongoose');
require('dotenv').config();

const Course = require('./models/Course');
const User = require('./models/User');

const debugEnrollments = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to database\n');

        // Get all courses with enrollments
        const courses = await Course.find({ studentsEnrolled: { $exists: true, $ne: [] } })
            .populate('studentsEnrolled', 'firstName lastName email');
        
        console.log('=== COURSES WITH ENROLLMENTS ===');
        for (const course of courses) {
            console.log(`\nCourse: ${course.courseName} (ID: ${course._id})`);
            console.log('Students Enrolled:');
            course.studentsEnrolled.forEach((student, i) => {
                console.log(`  ${i + 1}. ${JSON.stringify(student)} (Type: ${typeof student})`);
                if (student && student._id) {
                    console.log(`     ObjectId: ${student._id}`);
                }
            });
            console.log('Raw studentsEnrolled array:', course.studentsEnrolled);
        }

        // Get all users who are students
        console.log('\n\n=== ALL STUDENT USERS ===');
        const students = await User.find({ accountType: 'Student' }).select('firstName lastName email _id courses');
        for (const student of students) {
            console.log(`\nStudent: ${student.firstName} ${student.lastName} (${student.email})`);
            console.log(`  User ID: ${student._id}`);
            console.log(`  Enrolled courses: ${student.courses}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugEnrollments();
