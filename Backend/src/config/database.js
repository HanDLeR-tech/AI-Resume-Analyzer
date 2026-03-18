const mongoose = require("mongoose");

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ DB connected");
    } catch (err) {
        console.error("❌ DB connection failed:", err.message);
        process.exit(1); // stop server if DB fails
    }
}

module.exports = connectToDB;