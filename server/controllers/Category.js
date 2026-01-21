const Category = require('../models/category');
const Course = require('../models/Course');

// Create Category handler function
exports.createCategory = async (req, res) => {
    try {
        // Fetch data
        const { name, description } = req.body;

        // Validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details"
            });
        }

        // Create entry in DB
        const categoryDetails = await Category.create({
            name: name,
            description: description,
        });
        console.log(categoryDetails);

        // Return Response
        return res.status(200).json({
            success: true,
            message: "Category created successfully"
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Category cannot be created, Please try again later..."
        });
    }
}

// Get All Categories handler function
exports.showAllCategories = async (req, res) => {
    try {
        const allCategories = await Category.find({}, { name: true, description: true });
        res.status(200).json({
            success: true,
            message: "All Categories fetched successfully",
            data: allCategories
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Categories cannot be fetched, Please try again later..."
        });
    }
}

exports.categoryPageDetails = async (req, res) => {
    try {
        // Get Id from query params
        const {categoryId} = req.query;

        // Validation
        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required"
            });
        }

        // Get courses for specified id
        const selectedCategory = await Category.findById(categoryId)
                                             .populate({
                                                 path: "courses",
                                                 populate: [
                                                     {
                                                         path: "instructor",
                                                         select: "firstName lastName email image"
                                                     },
                                                     {
                                                         path: "coInstructors",
                                                         select: "firstName lastName _id"
                                                     }
                                                 ]
                                             })
                                             .exec();

        // Debug logging
        console.log("Selected Category Raw:", selectedCategory);
        console.log("Selected Category Courses:", selectedCategory?.courses);

        // Validation - check if category exists
        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Get courses for a different category
        const differentCategories = await Category.find({_id: {$ne: categoryId}})
                                                .populate({
                                                    path: "courses",
                                                    populate: [
                                                        {
                                                            path: "instructor",
                                                            select: "firstName lastName email image"
                                                        },
                                                        {
                                                            path: "coInstructors",
                                                            select: "firstName lastName _id"
                                                        }
                                                    ]
                                                })
                                                .exec();
        
        // Pick first different category with courses (with null checks)
        let differentCategory = null;
        if (differentCategories && differentCategories.length > 0) {
            differentCategory = differentCategories.find(cat => cat.courses && cat.courses.length > 0) || differentCategories[0];
        }

        // Get top-selling courses with full details
        const allCourses = await Course.find({})
                                       .populate({
                                           path: "instructor",
                                           select: "firstName lastName email image"
                                       })
                                       .populate({
                                           path: "coInstructors",
                                           select: "firstName lastName _id"
                                       })
                                       .exec();
        
        // Sort by students enrolled and limit to 10
        const topSellingCourses = allCourses
            .sort((a, b) => (b.studentsEnrolled?.length || 0) - (a.studentsEnrolled?.length || 0))
            .slice(0, 10);

        // Return response
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses: topSellingCourses
            }
        });
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error in fetching category details",
            error: err.message
        });
    }
}