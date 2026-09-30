const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middelware.js");
const userController=require("../controllers/userController");


router.get("/signUp",userController.renderSignUp);
router.post("/signUp",wrapAsync(userController.signUp));
router.get("/login",userController.renderLogin);
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);
router.get("/logout",userController.logout);


module.exports=router;