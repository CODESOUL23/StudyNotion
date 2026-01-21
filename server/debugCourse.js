const mongoose = require('mongoose');
require('dotenv').config();
const SubSection = require('./models/SubSection');
const Section = require('./models/Section');
const Course = require('./models/Course');

async function debug() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');

        // Check all courses with their sections
        const courses = await Course.find({}).populate({
            path: 'courseContent',
            populate: {
                path: 'subSection'
            }
        });

        console.log('\n=== Courses with Sections ===');
        courses.forEach(course => {
            console.log(`\nCourse: ${course.courseName}`);
            console.log(`  courseContent length: ${course.courseContent.length}`);
            if (course.courseContent.length > 0) {
                course.courseContent.forEach((section, i) => {
                    console.log(`  Section ${i + 1}: ${section.sectionName}`);
                    console.log(`    subSection count: ${section.subSection?.length || 0}`);
                    if (section.subSection && section.subSection.length > 0) {
                        section.subSection.forEach((sub, j) => {
                            console.log(`      Lecture ${j + 1}: ${sub.title}`);
                            console.log(`        videoUrl: ${sub.videoUrl || 'NOT SET'}`);
                        });
                    }
                });
            }
        });

        // Check all subsections
        console.log('\n=== All SubSections ===');
        const subsections = await SubSection.find({});
        subsections.forEach(sub => {
            console.log(`Title: ${sub.title}`);
            console.log(`  videoUrl: ${sub.videoUrl || 'NOT SET'}`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

debug();
