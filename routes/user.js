const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync");
const passport=require("passport");



router.get("/signUp",(req,res)=>{
    res.render("users/signUp.ejs");
})

router.post("/signUp", wrapAsync(async (req,res)=>{
   try{
     let {username,email,password}=req.body;
    const newUser=new User({username,email});
    const registeredUser=await User.register(newUser,password);
    req.flash("success","Welcome To Wanderlust");
    console.log(registeredUser);
    res.redirect("/listings");
   }
   catch(er){
    req.flash("error",er.message);
    res.redirect("/signUp");
   }
}));


router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login", passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust");
    res.redirect("/listings");
})



module.exports=router;