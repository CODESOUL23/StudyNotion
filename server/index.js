const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");
const adminRoutes = require("./routes/Admin");

const database = require("./config/database");
const PORT = process.env.PORT || 4000;
const cookieParser =   require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

require("dotenv").config();

//database connection
database.DBconnect();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true
    })
)

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp/"
    })
)

//cloudinary connection
cloudinaryConnect();
//routes mounting
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/courses",courseRoutes);
app.use("/api/v1/admin",adminRoutes);

app.get("/",(req,res)=>{
   return res.status(200).json({
         success:true,
         message:"Your server is up and running"
   })
})

app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`);
})
