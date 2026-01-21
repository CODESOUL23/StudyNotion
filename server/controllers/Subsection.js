const Subsection = require('../models/Subsection');
const Section = require('../models/Section');
const {uploadImageToCloudinary} = require('../utils/imageUploader');

//create subSection
exports.createSubsection= async (req, res) => {
    try{
        //fetch data from the req body
        const {sectionId , title , timeDuration , description} = req.body;
        //Jab humne koi course create kiya tabhi hum subsection create kar sakte hain

        //extract file/video - accept both 'videoFile' and 'video' field names
        const video = req.files?.videoFile || req.files?.video;

        //validation
        if(!sectionId || !title || !description || !video){
            return res.status(400).json({
                success:false,
                message:"Please fill all the details"
            })
        }
        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video , process.env.FOLDER_NAME);

        //create a sub section - use timeDuration if provided, otherwise use duration from cloudinary or default
        const subSectionDetails = await Subsection.create({
            title : title,
            timeDuration : timeDuration || uploadDetails.duration || "0",
            description: description,
            videoUrl : uploadDetails.secure_url
        })
        //update section with this sub section objectId
        const updatedSection = await Section.findByIdAndUpdate(
            {_id : sectionId} , 
            {$push : {subSection : subSectionDetails._id}} , 
            {new : true}
        ).populate("subSection");
        
        //return response with updated section
        return res.status(200).json({
            success:true,
            message:"Subsection created successfully",
            data: updatedSection
        })

    }
    catch(err){
        return res.status(500).json({
            success : false,
            message:"Subsection cannot be created, Please try again later..."
        })
    }
}

//HW : updateSection and deleteSection
exports.updateSubsection = async (req , res) =>{
    try{
        //get the data - accept both naming conventions
        const {title , description , timeDuration , sectionId} = req.body;
        const subSectionId = req.body.subSectionId || req.body.subsectionId;
        
        //validation - only subSectionId is required
        if(!subSectionId){
            return res.status(400).json({
                success:false,
                message:"Please provide subsection ID"
            })
        }
        
        // Build update object with only provided fields
        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (timeDuration) updateData.timeDuration = timeDuration;
        
        // Handle video upload if provided
        if (req.files && (req.files.video || req.files.videoFile)) {
            const video = req.files.video || req.files.videoFile;
            const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
            updateData.videoUrl = uploadDetails.secure_url;
            if (!timeDuration && uploadDetails.duration) {
                updateData.timeDuration = uploadDetails.duration;
            }
        }
        
        //update the subsection
        const updatedSubsection = await Subsection.findByIdAndUpdate(
            subSectionId, 
            updateData, 
            {new : true}
        );
        
        if(!updatedSubsection){
            return res.status(400).json({
                success:false,
                message:"Subsection not found...Please provide the correct subsection ID"
            })
        }
        
        // Return updated section with populated subsections
        const updatedSection = await Section.findById(sectionId).populate("subSection");
        
        //return response
        res.status(200).json({
            success:true,
            message:"Subsection updated successfully",
            data: updatedSection
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Subsection cannot be updated, Please try again later..."
        })
    }
}

exports.deleteSubsection = async(req , res) => {
    try {
        //get data - accept both naming conventions
        const subSectionId = req.body.subSectionId || req.body.subsectionId;
        const sectionId = req.body.sectionId;
        
        //validation
        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: "Please provide the subsection ID"
            })
        }
        //find the subsection and delete
        await Subsection.findByIdAndDelete(subSectionId);
        
        //delete the subsection id reference from the section schema
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            {$pull: {subSection: subSectionId}}, 
            {new: true}
        ).populate("subSection");
        
        if (!updatedSection) {
            return res.status(400).json({
                success: false,
                message: "Section not found"
            })
        }
        //return response
        res.status(200).json({
            success: true,
            message: "Subsection deleted successfully",
            data: updatedSection
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Subsection cannot be deleted, Please try again later..."
        })
    }
}

exports.categoryPageDetails = async (req, res) => {
    try {
        // Get Id
        const {categoryId} = req.body;

        // Get courses for specified id
        const selectedCategory = await Category.find({_id:categoryId})
                                             .populate("courses")
                                             .exec();

        // Get course for different categories
        const differentCategories = await Category.find({_id: {$ne: categoryId}})
                                                .populate({ path: "courses", select: "name description" })
                                                .exec();

        // Get top-selling courses
        const topSellingCourses = await Course.aggregate([
            // Stage 1: Add field for students count
            {
                $addFields: {
                    studentsCount: { $size: "$studentsEnrolled" }
                }
            },
            // Stage 2: Sort by students count
            {
                $sort: { studentsCount: -1 }
            },
            // Stage 3: Limit results
            {
                $limit: 10
            },
            // Stage 4: Project needed fields
            {
                $project: {
                    courseName: 1,
                    courseDescription: 1,
                    thumbnail: 1,
                    studentsCount: 1
                }
            }
        ]);

        // Return response
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategories,
                topSellingCourses
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