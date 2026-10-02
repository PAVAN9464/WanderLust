const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middelware.js");
const userController=require("../controllers/userController");


router.route("/signUp")
	.get(userController.renderSignUp)
	.post(wrapAsync(userController.signUp));

router.route("/login")
	.get(userController.renderLogin)
	.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);

router.route("/logout").get(userController.logout);


module.exports=router;