require("dotenv").config();
const app = require('./src/app.js');
const connectToDB = require("./src/config/database.js");

connectToDB();

app.listen(3000, () => {
    console.log("Server is Running on Port 3000")
})