const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/Subsection");

// Update course progress - mark a lecture as complete
exports.updateCourseProgress = async (req, res) => {
    try {
        const { courseId, subsectionId } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!courseId || !subsectionId) {
            return res.status(400).json({
                success: false,
                message: "Course ID and Subsection ID are required"
            });
        }

        // Check if subsection exists
        const subsection = await SubSection.findById(subsectionId);
        if (!subsection) {
            return res.status(404).json({
                success: false,
                message: "Subsection not found"
            });
        }

        // Find or create course progress for this user and course
        let courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId
        });

        if (!courseProgress) {
            // Create new progress record
            courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [subsectionId]
            });
        } else {
            // Check if already completed
            if (courseProgress.completedVideos.includes(subsectionId)) {
                return res.status(200).json({
                    success: true,
                    message: "Lecture already marked as complete"
                });
            }
            // Add to completed videos
            courseProgress.completedVideos.push(subsectionId);
            await courseProgress.save();
        }

        return res.status(200).json({
            success: true,
            message: "Lecture marked as complete"
        });

    } catch (error) {
        console.error("Error updating course progress:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update course progress",
            error: error.message
        });
    }
};

// Get course progress for a user
exports.getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        const courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId
        });

        if (!courseProgress) {
            return res.status(200).json({
                success: true,
                data: {
                    completedVideos: []
                }
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                completedVideos: courseProgress.completedVideos
            }
        });

    } catch (error) {
        console.error("Error getting course progress:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get course progress",
            error: error.message
        });
    }
};
