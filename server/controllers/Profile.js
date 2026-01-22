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

// Submit instructor verification request
exports.submitVerificationRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        // Accept either detailed fields OR a simple documents text
        const { documents, experience, expertise, linkedIn, portfolio, bio } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.accountType !== "Instructor") {
            return res.status(400).json({
                success: false,
                message: "Only instructors can submit verification requests"
            });
        }

        if (user.verificationStatus === "approved") {
            return res.status(400).json({
                success: false,
                message: "You are already a verified instructor"
            });
        }

        // Handle qualification document upload if provided
        let qualificationUrl = user.verificationDocuments?.qualification;
        if (req.files && req.files.qualification) {
            const qualification = req.files.qualification;
            const uploadResult = await uploadImageToCloudinary(
                qualification,
                process.env.FOLDER_NAME,
                1000,
                1000
            );
            qualificationUrl = uploadResult.secure_url;
        }

        // Update verification documents - support both simple text and detailed fields
        user.verificationDocuments = {
            qualification: qualificationUrl,
            experience: experience || user.verificationDocuments?.experience,
            expertise: expertise ? (typeof expertise === 'string' ? JSON.parse(expertise) : expertise) : user.verificationDocuments?.expertise,
            linkedIn: linkedIn || user.verificationDocuments?.linkedIn,
            portfolio: portfolio || user.verificationDocuments?.portfolio,
            bio: documents || bio || user.verificationDocuments?.bio  // Use documents as bio if no detailed bio provided
        };

        user.verificationStatus = "pending";
        user.verificationRequestedAt = new Date();

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Verification request submitted successfully. Our team will review your application.",
            verificationStatus: user.verificationStatus
        });

    } catch (error) {
        console.log("Verification request error:", error);
        return res.status(500).json({
            success: false,
            message: "Error submitting verification request",
            error: error.message
        });
    }
}

// Get instructor verification status
exports.getVerificationStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select(
            "isVerified verificationStatus verificationDocuments verificationRequestedAt verifiedAt rejectionReason"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                isVerified: user.isVerified,
                verificationStatus: user.verificationStatus,
                verificationDocuments: user.verificationDocuments,
                verificationRequestedAt: user.verificationRequestedAt,
                verifiedAt: user.verifiedAt,
                rejectionReason: user.rejectionReason
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching verification status",
            error: error.message
        });
    }
}

// Admin: Get all pending verification requests
exports.getPendingVerifications = async (req, res) => {
    try {
        const pendingInstructors = await User.find({
            accountType: "Instructor",
            verificationStatus: "pending"
        })
        .select("firstName lastName email image verificationDocuments verificationRequestedAt createdAt")
        .sort({ verificationRequestedAt: -1 });

        return res.status(200).json({
            success: true,
            data: pendingInstructors,
            count: pendingInstructors.length
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching pending verifications",
            error: error.message
        });
    }
}

// Admin: Approve instructor verification
exports.approveInstructor = async (req, res) => {
    try {
        const { instructorId } = req.body;

        if (!instructorId) {
            return res.status(400).json({
                success: false,
                message: "Instructor ID is required"
            });
        }

        const instructor = await User.findById(instructorId);

        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found"
            });
        }

        if (instructor.accountType !== "Instructor") {
            return res.status(400).json({
                success: false,
                message: "User is not an instructor"
            });
        }

        instructor.isVerified = true;
        instructor.verificationStatus = "approved";
        instructor.verifiedAt = new Date();
        instructor.rejectionReason = null;

        await instructor.save();

        // TODO: Send approval email to instructor

        return res.status(200).json({
            success: true,
            message: `Instructor ${instructor.firstName} ${instructor.lastName} has been verified successfully`
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error approving instructor",
            error: error.message
        });
    }
}

// Admin: Reject instructor verification
exports.rejectInstructor = async (req, res) => {
    try {
        const { instructorId, reason } = req.body;

        if (!instructorId) {
            return res.status(400).json({
                success: false,
                message: "Instructor ID is required"
            });
        }

        const instructor = await User.findById(instructorId);

        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found"
            });
        }

        instructor.isVerified = false;
        instructor.verificationStatus = "rejected";
        instructor.rejectionReason = reason || "Your application did not meet our requirements. Please update your profile and try again.";

        await instructor.save();

        // TODO: Send rejection email to instructor

        return res.status(200).json({
            success: true,
            message: `Instructor verification rejected`
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error rejecting instructor",
            error: error.message
        });
    }
}