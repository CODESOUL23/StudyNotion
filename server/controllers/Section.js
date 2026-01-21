const Section  = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req , res) =>{
    try{
        //data fetch - accept both courseId and courseID for compatibility
        const {sectionName, courseId, courseID} = req.body;
        const actualCourseId = courseId || courseID;
        
        //data validation
        if(!sectionName || !actualCourseId){
            return res.status(400).json({
                success:false,
                message:"Please fill all the details"
            })
        }
        //create section
        const newSection = await Section.create({
            sectionName : sectionName,
        });

        //course schema mei ID push karni padegi
        const updatedCourse = await Course.findOneAndUpdate(
            {_id : actualCourseId}, 
            {$push : {courseContent : newSection._id}}, 
            {new : true}
        ).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        }).exec();
        
        //return res
        res.status(200).json({
            success : true,
            message : "Section created successfully and added to the respective course",
            updatedCourse,
        })
    }
    catch(err){
         return res.status(500).json({
                success:false,
                message:"Section cannot be created, Please try again later..."
            })
    }
}

exports.updateSection = async (req , res) => {
    try{
        //data fetch - accept both sectionId and sectionID for compatibility
        const {sectionName, sectionId, sectionID, courseId, courseID} = req.body;
        const actualSectionId = sectionId || sectionID;
        const actualCourseId = courseId || courseID;
        
        //data validation
        if(!sectionName || !actualSectionId){
            return res.status(400).json({
                success:false,
                message:"Please fill all the details"
            })
        }
        //update schema
        await Section.findOneAndUpdate({_id : actualSectionId} , {sectionName : sectionName} , {new : true});

        // Get updated course with populated content
        const updatedCourse = await Course.findById(actualCourseId)
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            }).exec();

        //return response
        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
            data: updatedCourse
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Section cannot be updated, Please try again later..."
        })
    }
}

exports.deleteSection = async (req , res) =>{
   try{
       //data fetch - accept both sectionId and sectionID
       const {sectionId, sectionID, courseId, courseID} = req.body;
       const actualSectionId = sectionId || sectionID;
       const actualCourseId = courseId || courseID;

       //delete the Section Schema
      await Section.findByIdAndDelete(actualSectionId);
       //Update the course Schema
       await Course.findOneAndUpdate(
           {_id: actualCourseId}, 
           {$pull : {courseContent : actualSectionId}}, 
           {new : true}
       );
       
       // Get updated course
       const updatedCourse = await Course.findById(actualCourseId)
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            }).exec();
            
       //return response
       return res.status(200).json({
           success:true,
           message:"Section deleted successfully",
           data: updatedCourse
       })
   }
   catch(err){
         return res.status(500).json({
              success:false,
              message:"Section cannot be deleted, Please try again later..."
         })
   }
}