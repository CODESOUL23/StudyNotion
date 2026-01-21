const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//resetPasswordToken
exports.resetPasswordToken = async(req , res) =>{
    //extract email
    try{
        const {email} = req.body;

        //check user for this email , exists or not
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not registered"
            })
        }

        //generate token
        const token = crypto.randomUUID();

        //update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate({email : email} , {token : token , resetPasswordExpires : Date.now() + 5*60*1000} , {new : true});

        //create url
        const url = `https://localhost:3000/update-password/${token}`;
        //Ek token se ek hi user ka password rset karne ka logic hai , isliye token ko url mei daal ke bhej rahe hain

        //send email containing the url
        await mailSender(email , "Reset Password Link : " , url);

        //return response
        return res.status(200).json({
            success:true,
            message:"Reset Password link sent to your email"
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Reset Password link cannot be sent , Please try again later..."
        })
    }
}


//resetPassword
exports.resetPassword =async(req , res) =>{
     try{
         //data fetch
         const {password  , confirmPassword , token} = req.body;
         /*Yeh token req ki body mei frontEnd ne daala hai varna it was present in the URL*/

         //validation
         if(password !== confirmPassword){
             return res.status(400).json({
                 success:false,
                 message:"Passwords should match..."
             })
         }
         //get userDetails from DB using token
         const userDetails = await User.findOne({token});

         //if no entry - inavlid token
         if(!userDetails){
             return res.status(400).json({
                 success:false,
                 message:"Invalid token"
             })
         }
         //token time check
         if(userDetails.resetPasswordExpires < Date.now()){
             return res.status(400).json({
                 success:false,
                 message:"Token expired , please regenerate your token"
             })
         }
         //hash pwd
         const hashedPassword = await bcrypt.hash(password , 10);

         //password update
         await User.findOneAndUpdate({token} , {password : hashedPassword} , {new : true});

         //return response
         return res.status(200).json({
                success:true,
                message:"Password updated successfully"
         })
     }
     catch(err){
            console.log(err);
            return res.status(500).json({
                success:false,
                message:"Password cannot be updated , Please try again later..."
            })
     }
}