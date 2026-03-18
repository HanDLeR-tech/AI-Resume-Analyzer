const userModel = require('../models/user.model.js'); 
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklist.model.js");


/**
 * 
 * @name registerUserController
 * @description register a new user , expects username,email, and password in the request body
 * @access Public
 */

async function registerUserController(req, resp) {

    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return resp.status(400).json({
            message: "Please provide username,email and password"
        })
    }

    const isUserAlreadyExist = await userModel.findOne({
        $or :[{username},{email}]
    })

    if (isUserAlreadyExist) {
        return resp.status(400).json({
            message:"Account already exists with this email address or username"
        })
    }

    const hash = await bycrypt.hash(password, 10);
    
    const user = await userModel.create({
        username,
        email,
        password:hash
    })

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

res.cookie("token", token, {
    httpOnly: true,
    secure: true,        // required for HTTPS
    sameSite: "None",    // VERY IMPORTANT
});
    resp.status(200).json({
        message: "User Successfully registered",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

    
}

/**
 * 
 * @name registerUserController
 * @description register a new user , expects username,email, and password in the request body
 * @access  Public
 */

async function loginUserController(req, resp) {

    const { username , email, password } = req.body;
    
    const user = await userModel.findOne({ email });

    if (!user) {
        return resp.status(400).json({
            message:"Invalid email or password"
        })
    }

    const isPasswordValid = await bycrypt.compare(password, user.password);

     if (!isPasswordValid) {
        return resp.status(400).json({
            message:"Invalid email or password"
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    resp.cookie("token", token);

    return resp.status(200).json({
        message: "User Succesfully Logged In",
        user: {
            id: user._id,
            username: user.username,
            email:user.email
        }
    })
    
}

/**
 * 
 * @name logoutUserController
 * @description add the token in blacklist , remove it from cookie 
 * @access Public
 */

async function logoutUserController(req, resp) {
    const token = req.cookies.token;

    if (token) {
        await blacklistTokenModel.create({ token });
    }

    resp.clearCookie("token");

    resp.status(200).json({
        message:"User Successfully Logged Out"
    })
}

/**
 * 
 * @name getMeController
 * @description gets the current logged in users detail
 * @access Public
 */

async function getMeController(req, resp) {
    
    const user = await userModel.findById(req.user.id);

    resp.status(200).json({
        message: "User Details Fetched Successfully",
        user: {
            id: user._id,
            username: user.username,
            email:user.email
        }
    })
}

module.exports = { registerUserController,loginUserController , logoutUserController,getMeController};