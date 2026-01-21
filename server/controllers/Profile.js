const Profile = require('../models/Profile');
const User = require('../models/User');
const {uploadImageToCloudinary} = require("../utils/imageUploader");

exports.updateProfile = async (req, res) => {
    try {
        // Get data from request body
        const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
        // Get user ID from request
        const id = req.user.id;
        // Validation
        if (!contactNumber || !gender || !id) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details"
            });
        }

        // Find user details
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;

        // Retrieve profile details using profileId
        const profileDetails = await Profile.findById(profileId);
        if (!profileDetails) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        // Update profile details
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;
        await profileDetails.save();
        //Humne aise isiliye kiya hai kyuki hamare paas profileDetails naam ka pehle se ek object bana hua tha
        //We just updated the values of that object and saved it

        // Get updated user details with populated profile
        const updatedUserDetails = await User.findById(id)
            .populate("additionalDetails")
            .exec();

        // Return response
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            updatedUserDetails: updatedUserDetails
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

//deleteAccount
exports.deleteAccount = async (req , res) =>{
    try{
        //get ID from request
        console.log("Hello");
        const id = req.user.id;
        //validation
        console.log("Hello");
        const userDetails = await User.findById({_id : id});
        console.log("hello")
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User Not Found"
            })
        }
        console.log(userDetails);
        //Profile delete
        console.log("Deleting Profile");
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

        //User delete
        console.log("Deleting from User")
        await User.findByIdAndDelete({_id: id});

        //TODO : unroll user from all unrolled courses
        //TODO : crone Job to delete the user's data from the database after 7 days

        //return response
        return res.status(200).json({
            success:true,
            message:"Account deleted successfully"
        })

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Account cannot be deleted, Please try again later..."
        })
    }
}

exports.getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id;
        const userDetails = await User.findById(id)
            .populate("additionalDetails")
            .exec();
        console.log(userDetails);
        res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: userDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateDisplayPicture = async (req, res) => {
    try {
        const displayPicture = req.files.displayPicture
        const userId = req.user.id
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(image)
        const updatedProfile = await User.findByIdAndUpdate(
            { _id: userId },
            { image: image.secure_url },
            { new: true }
        )
        res.send({
            success: true,
            message: `Image Updated successfully`,
            data: updatedProfile,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id
        const userDetails = await User.findOne({
            _id: userId,
        })
            .populate("courses")
            .exec()
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find user with id: ${userDetails}`,
            })
        }
        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}