const express=require("express");
const app=express();
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const Listing=require("./models/Listing")
const path=require("path");
const ejsMate=require("ejs-mate");
const PORT=8080;
const wrapAsync=require("./utils/wrapAsync");
const ExpressError=require("./utils/ExpressError");
const {listingSchema, reviewSchema}=require("./schema");
const Review=require("./models/review");




const validateListing=(req,res,next)=>{
    const {error,value}=listingSchema.validate(req.body);
    if(error){
        const message=error.details.map(detail=>detail.message).join(", ");
        return next(new ExpressError(400,message));
    }
    req.body=value;
    next();
};

const validateReview=(req,res,next)=>{
    const {error,value}=reviewSchema.validate(req.body);
    if(error){
        const message=error.details.map(detail=>detail.message).join(", ");
        return next(new ExpressError(400,message));
    }
    req.body=value;
    next();
};

const MONGO_URL="mongodb://127.0.0.1:27017/Wanderlust";
main().catch(err => console.log(err));


async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected!");
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));


app.get("/",(req,res)=>{
    res.send("At root directory");
});

//Index Route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Create new Route
app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit",wrapAsync(async (req,res,next)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        return next(new ExpressError(404,"Listing not found"));
    }
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
app.patch("/listings/:id",validateListing,wrapAsync(async (req,res,next)=>{
    const {id}=req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing);
    res.redirect(`/listings/${id}`);
}));

//Destroy Route
app.delete("/listings/:id",wrapAsync(async (req,res,next)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//Show Route
app.get("/listings/:id",wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    if(!listing){
        return next(new ExpressError(404,"Listing not found"));
    }
    res.render("listings/show.ejs",{listing});
}));

//Create Review Route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req,res,next)=>{
    let listing=await Listing.findById(req.params.id);
    if(!listing){
        return next(new ExpressError(404,"Listing not found"));
    }
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));


app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});
app.use((err,req,res,next)=>{
    const status=err.status || err.statusCode || 500;
    const message=err.message || "Something went wrong";
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