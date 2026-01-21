const User = require('../models/User');
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator = require('otp-generator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();



//sendOTP
exports.sendOTP = async (req , res) =>{
    try{
        //fetch email from the request body
        const {email} = req.body;

        //Check if the user is already present
        const checkUserPresent = await User.findOne({email});
        if(checkUserPresent){
            return res.status(401).json({
                success : false,
                message : "User Already Registered"
            })
        }
        //Generate OTP
        var otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false, alphabets: false , digits : true });
        console.log("OTP Generated : " , otp);

        //Check unique OTP or not
        let result = await OTP.findOne({otp : otp});

        while (result){
            otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false, alphabets: false , digits : true });
            result = await OTP.findOne({otp : otp});
        }

        const otpPayload = {email , otp};

        // create an entry for OTP
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //Return Response
        res.status(200).json({
            success : true,
            message : "OTP Sent Successfully",
            otp,
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "OTP cannot be sent, Please try again later..."
        })
    }
}


//signup
exports.signup = async (req , res) =>{
    try{
        //data fetch from the req body
        const {firstName , lastName , email , password , confirmPassword , accountType  , otp} = req.body;


        //validate karo
        if(!firstName || !lastName || !email || !password || !confirmPassword || !accountType|| !otp){
            return res.status(403).json({
                success : false,
                message : "Please fill all the details"
            })
        }


        //2 passwords match karlo
        if(password !== confirmPassword){
            return res.status(400).json({
                success : false,
                message : "Passwords do not match...Please Try Again"
            })
        }


        //check user already or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success : false,
                message : "User already exists"
            })
        }

        //find the most recent otp for the user
        const recentOtp = await OTP.find({email}).sort({createdAt : -1}).limit(1);
        //Recent most value fetch karli
        //.sort({createdAt : -1}): Descending order mei sort kar dega and sabse recent otp will be on the first index
        //.limit(1): Sirf 1 value fetch karega
        console.log(recentOtp);


        //validate otp

        if(recentOtp.length === 0){
            return res.status(400).json({
                success : false,
                message : "Please request for OTP first"
            })
        }

        else if(otp !== recentOtp[0].otp){
            return res.status(400).json({
                success : false,
                message : "Invalid OTP"
            })
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password , 10);



        //entry in the database

        const profileDetails=await Profile.create({
            gender : null ,
            dateOfBirth : null ,
            about : null ,
            contactNumber : null
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            password : hashedPassword,
            accountType,
            additionalDetails : profileDetails._id,
            image : `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

        //send response
        return res.status(200).json({
            success : true,
            message : "User Registered Successfully"
        })
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered ... Please Try again"
        })
    }
}


//login
exports.login = async (req , res) => {
    try{
        //get data from the req body
        const {email , password} = req.body;

        //validation data
        if(!email || !password){
            return res.status(403).json({
                success : false,
                message : "Please fill all the details"
            })
        }

        //user check exist or not
        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success : false,
                message : "User not registered"
            })
        }


        //password match or not
        if(await bcrypt.compare(password , user.password)){
            const payload= {
                email : user.email,
                id : user._id,
                accountType : user.accountType
            }

            //generate JWT - expires in 24 hours
            const token = jwt.sign(payload , process.env.JWT_SECRET , {expiresIn : "24h"});
            user.token = token;
            user.password = undefined;

            //Create cookie and send response
            const options = {
                expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly : true,
            }
            res.cookie("token" , token , options).status(200).json({
                success : true,
                token,
                user,
                message : "Logged In Successfully",
            })
        }
        else{
            return res.status(401).json({
                success : false,
                message : "Invalid Password"
            })
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "User cannot be logged in ... Please Try again"
        })
    }

}

//changePassword
exports.changePassword = async (req , res) => {
    //get data from the req.body
    //get oldPassword , newPassword , confirmPassword
    const {email , oldPassword , newPassword , confirmPassword} = req.body;

    //validation
    if(!oldPassword || !newPassword || !confirmPassword){
        return res.status(403).json({
            success : false,
            message : "Please fill all the details"
        })
    }
    if(newPassword !== confirmPassword){
        return res.status(400).json({
            success : false,
            message : "Passwords do not match"
        })
    }

    //hash the new password
    const hashedPassword = await bcrypt.hash(newPassword , 10);
    //update pwd in DB
    await User.findOneAndUpdate({email} , {password : hashedPassword} , {new : true});

    //send mail - Password update
    await mailSender(email , "Password Update" , "Your password has been updated successfully");

    //return response
    return res.status(200).json({
        success : true,
        message : "Password Updated Successfully"
    })
}
