const mongoose = require("mongoose");
require("dotenv").config();

exports.DBconnect = () => {
    mongoose.connect(process.env.DATABASE_URL)
        .then(() => { console.log("DB Connected Successfully") })
        .catch((err) => {
            console.log("DB Connection Issues");
            console.error(err);
            process.exit(1);
        });
}