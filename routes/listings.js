const express=require("express");
const router=express.Router();
const Listing=require("../models/Listing")
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const {listingSchema, reviewSchema}=require("../schema");
const flash=require("connect-flash");

const validateListing=(req,res,next)=>{
    const {error,value}=listingSchema.validate(req.body);
    if(error){
        const message=error.details.map(detail=>detail.message).join(", ");
        return next(new ExpressError(400,message));
    }
    req.body=value;
    next();
};


//Index Route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//New Route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Create new Route
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit",wrapAsync(async (req,res,next)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","The requested Listing does not exist");
        res.redirect("/listings");
    }
   else res.render("listings/edit.ejs",{listing});
}));

//Update Route
router.patch("/:id",validateListing,wrapAsync(async (req,res,next)=>{
    const {id}=req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing);
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}));

//Destroy Route
router.delete("/:id",wrapAsync(async (req,res,next)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}));

//Show Route
router.get("/:id",wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","The requested Listing does not exist");
        res.redirect("/listings");
    }
    else res.render("listings/show.ejs",{listing});
}));

module.exports=router;