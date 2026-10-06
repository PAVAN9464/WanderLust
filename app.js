if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const path=require("path");
const ejsMate=require("ejs-mate");
const PORT=8080;
const ExpressError=require("./utils/ExpressError");
const session=require("express-session");
const MongoStore = require('connect-mongo').default;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local").Strategy;
const User=require("./models/user.js");

const listingRouter=require("./routes/listings.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


const dbUrl=process.env.ATLAS_URL;
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
    console.log("MongoDB connected!");
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));


// app.route("/").get((req,res)=>{
//     res.send("At root directory");
// });
const store=MongoStore.create({
    mongoUrl:dbUrl,
   crypto:{
    secret: process.env.SESSION_SECRET,
   },
    touchAfter:24*3600,

});
store.on("error",()=>{
    console.log("Error is Mongo Session store",err);

})
const sessionOptions={
    store,
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}


app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;

    next();
})


app.get("/",(req,res)=>{
    res.redirect("/listings");
});


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// app.get("/demoUser", async (req,res)=>{
//     let fakeUser=new User({
//         email:"aba@gmail.com",
//         username:"ABA"
//     });
//     let registeredUser=await User.register(fakeUser,"aba123");
//     res.send(registeredUser);
// })



app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});
app.use((err,req,res,next)=>{
    const isUploadTooLarge=err.code === "LIMIT_FILE_SIZE";
    const status=isUploadTooLarge ? 413 : err.status || err.statusCode || 500;
    const message=isUploadTooLarge ? "Image uploads must be 5 MB or smaller" : err.message || "Something went wrong";
    res.status(status).render("error.ejs",{status,message});
});

// app.get("/ListingTest",async (req,res)=>{
//         let sample=new Listing({
//             title:"Beach",
//             description:"Maya Beach Goa",
//             price:1500,
//             location:"Goa",
//             country:"India",

//         })
//         await sample.save().catch((err)=>console.log(err));
//         res.send("Saved Successfuly");
// })
app.listen(PORT, (req,res)=>{
    console.log("Listening to Port");
});