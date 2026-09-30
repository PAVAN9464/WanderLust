const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/Listing")
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const {reviewSchema}=require("../schema");
const Review=require("../models/review");
const {isLoggedIn,isReviewAuthor}= require("../middelware");

const validateReview=(req,res,next)=>{
    const {error,value}=reviewSchema.validate(req.body);
    if(error){
        const message=error.details.map(detail=>detail.message).join(", ");
        return next(new ExpressError(400,message));
    }
    req.body=value;
    next();
};


//Create Review Route
router.post("/", validateReview,isLoggedIn, wrapAsync(async(req,res,next)=>{
    let listing=await Listing.findById(req.params.id);
    if(!listing){
        return next(new ExpressError(404,"Listing not found"));
    }
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created");
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
router.delete("/:reviewId", isLoggedIn, wrapAsync(isReviewAuthor), wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports=router;