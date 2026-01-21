const jwt = require ("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");


//auth middleware
exports.auth = async(req , res , next) =>{
    try {
        // Extract Token from multiple sources
        const authHeader = req.header("Authorization");
        const token = req.body.token || 
                      req.cookies.token || 
                      (authHeader && authHeader.replace("Bearer ", ""));
        
        //if token is missing
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            })
        }
        //Verify Token
        try {
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log("Token decoded:", decode);
            req.user = decode;
        } catch (err) {
            console.log("Token verification error:", err.message);
            return res.status(401).json({
                success: false,
                message: "Token Invalid"
            });
        }
        next();
    }
    catch(err){
        console.log("Auth middleware error:", err);
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token"
        })
    }
}


//isStudent middleware
exports.isStudent = async(req , res , next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for students"
            })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User role is not matching"
        })
    }
}

//isInstructor middleware

exports.isInstructor = async(req , res , next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor"
            })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User role is not matching"
        })
    }
}

//isAdmin middleware
exports.isAdmin = async(req , res , next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin"
            })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User role is not matching"
        })
    }
}