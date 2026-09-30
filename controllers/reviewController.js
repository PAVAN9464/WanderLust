const Listing=require("../models/Listing");
const Review=require("../models/review");
const ExpressError=require("../utils/ExpressError");

module.exports.createReview=async (req,res,next)=>{
    const listing=await Listing.findById(req.params.id);
    if(!listing){
        return next(new ExpressError(404,"Listing not found"));
    }

    const newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview=async (req,res)=>{
    const {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
};