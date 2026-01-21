//Jab bhi hume mail send karne ki zarurat padegi hume mailSender function ka use karna rahega...
//That's why humne yeh function alag se banaya hai...

const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try{
        let transporter = nodemailer.createTransport({
            host : process.env.MAIL_HOST,
            auth:{
                user : process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        })

        let info = await transporter.sendMail({
            from : "CodeSoul - By Mridul",
            to : `${email}`,
            subject : `${title}`,
            html : `${body}`,
        });
        console.log(info);
        return info;
    }
    catch(err){
        console.log(err.message);
    }
};

module.exports = mailSender;