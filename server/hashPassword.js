const bcrypt = require("bcrypt");

async function hashPassword() {
    const password = "123456"; // Change this to your desired password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("\n=================================");
    console.log("Password:", password);
    console.log("Hashed Password:", hashedPassword);
    console.log("=================================\n");
    console.log("Copy the hashed password and use it in MongoDB");
}

hashPassword();
