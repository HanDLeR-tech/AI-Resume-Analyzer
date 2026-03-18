const express = require("express");
const authController = require("../controllers/auth.controller.js");
const authRouter = express.Router();
const authMiddleware = require("../middleware/auth.middleware.js");



/**
 * @routes POST/api/auth/register
 * @description Register a new user
 * @access Public
 */

authRouter.post('/register', authController.registerUserController);

/**
 * @routes POST/api/auth/login
 * @description login user with email and password
 * @access Public
 */

authRouter.post('/login', authController.loginUserController);


/**
 * @routes GET/api/auth/logout
 * @description logout user and blacklist token
 * @access Public
 */

authRouter.get('/logout', authController.logoutUserController);


/**
 * @routes GET/api/auth/get-me
 * @description gets the current logged in user details
 * @access Public
 */

authRouter.get('/get-me',authMiddleware.authUser,authController.getMeController);





module.exports = authRouter;