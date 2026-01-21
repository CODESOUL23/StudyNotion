const mongoose = require('mongoose');
require('dotenv').config();

const Course = require('./models/Course');

async function testEditCourse() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');

        // Get the Web Dev course
        const courses = await Course.find({}).select('_id courseName tag instructions');
        
        console.log('\n=== All Courses ===');
        courses.forEach(course => {
            console.log(`\nCourse: ${course.courseName}`);
            console.log(`  ID: ${course._id}`);
            console.log(`  tag type: ${typeof course.tag}, value:`, course.tag);
            console.log(`  instructions type: ${typeof course.instructions}, isArray:`, Array.isArray(course.instructions));
        });

        // Test what happens when we try to update
        const testCourse = courses[0];
        if (testCourse) {
            console.log('\n=== Testing Update ===');
            
            // Simulate what the controller does
            const updates = {
                courseId: testCourse._id.toString(),
                courseName: testCourse.courseName
            };
            
            for (const key in updates) {
                if (key === "tag" || key === "instructions") {
                    try {
                        const parsed = typeof updates[key] === 'string' 
                            ? JSON.parse(updates[key]) 
                            : updates[key];
                        console.log(`Parsed ${key}:`, parsed);
                    } catch (e) {
                        console.log(`Error parsing ${key}:`, e.message);
                    }
                }
            }
        }

        await mongoose.disconnect();
        console.log('\nDone');
    } catch (error) {
        console.error('Error:', error);
    }
}

testEditCourse();
