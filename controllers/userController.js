const User=require("../models/user");

module.exports.renderSignUp=(req,res)=>{
    res.render("users/signUp.ejs");
};

module.exports.signUp=async (req,res)=>{
    try{
        const {username,email,password}=req.body;
        const newUser=new User({username,email});
        const registeredUser=await User.register(newUser,password);
        await new Promise((resolve,reject)=>{
            req.login(registeredUser,error=>error ? reject(error) : resolve());
        });
        req.flash("success","Welcome To Wanderlust");
        res.redirect("/listings");
    }catch(error){
        req.flash("error",error.message);
        res.redirect("/signUp");
    }
};

module.exports.renderLogin=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=(req,res)=>{
    req.flash("success","Welcome back to Wanderlust");
    const redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout(error=>{
        if(error){
            return next(error);
        }
        req.flash("success","Logged Out successfully");
        res.redirect("/listings");
    });
};