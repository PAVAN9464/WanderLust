const express=require("express");
const router=express.Router();
const Listing=require("../models/Listing")
const wrapAsync=require("../utils/wrapAsync");
const {isLoggedIn,isOwner,validateListing} = require("../middelware");


//Index Route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//New Route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
});

//Create new Route
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res,next)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","The requested Listing does not exist");
        res.redirect("/listings");
    }
   else res.render("listings/edit.ejs",{listing});
}));

//Update Route
router.patch("/:id",validateListing,isLoggedIn,isOwner,wrapAsync(async (req,res,next)=>{
    
    await Listing.findByIdAndUpdate(id,req.body.listing);
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}));

//Destroy Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res,next)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}));

//Show Route
router.get("/:id",wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
        .populate({path:"reviews",populate:{path:"author"}})
        .populate("owner");
    if(!listing){
        req.flash("error","The requested Listing does not exist");
        res.redirect("/listings");
    }
    else res.render("listings/show.ejs",{listing});
}));

module.exports=router;