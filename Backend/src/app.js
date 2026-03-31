const express = require('express'); 
const app = express();

app.set("trust proxy", 1); 


const cookieParser = require("cookie-parser");
const cors = require("cors");


app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://ai-resume-analyzer-gray-gamma.vercel.app",
        "https://ai-resume-analyzer-git-main-handler-techs-projects.vercel.app"
    ],
    credentials: true
}));


app.use(express.json());//allows to read data from the req body
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

/*  Require all the routes here */
const authRouter = require("./routes/auth.routes.js");
const interviewRouter = require("./routes/interview.routes.js");

/* Use all the routes here */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);


app.get("/", (req, res) => {
    res.send("API is running 🚀");
});



module.exports = app;