const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklist.model.js");

async function authUser(req, resp, next) {


    console.log("Cookies:", req.cookies);

    const token = req.cookies.token;

    if (!token) {
        return resp.status(400).json({
            message:"Token not verified"
        })
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token });

    if (isBlacklisted) {
        return resp.status(400).json({
            message:"Token is INVALID"
        })
        
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        
        return resp.status(401).json({
            message:"Invalid token"
        })  
        
    }

}


module.exports = { authUser };