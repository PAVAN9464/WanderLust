const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync");
const {isLoggedIn,isReviewAuthor,validateReview}=require("../middelware");
const reviewController=require("../controllers/reviewController");


//Create Review Route
router.route("/").post(isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//Delete Review Route
router.route("/:reviewId").delete(isLoggedIn,wrapAsync(isReviewAuthor),wrapAsync(reviewController.deleteReview));

module.exports=router;