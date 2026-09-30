const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const {isLoggedIn,isOwner,validateListing} = require("../middelware");
const listingController=require("../controllers/listingController");


//Index Route
router.get("/",wrapAsync(listingController.index));

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//Create new Route
router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//Update Route
router.patch("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

//Destroy Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

//Show Route
router.get("/:id",wrapAsync(listingController.showListing));

module.exports=router;