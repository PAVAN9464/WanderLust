const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const {isLoggedIn,isOwner,validateListing} = require("../middelware");
const listingController=require("../controllers/listingController");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

//Index and create routes
router.route("/")
	.get(wrapAsync(listingController.index))
	.post(isLoggedIn,upload.single("listing[image][url]"),validateListing,wrapAsync(listingController.createListing));
    
    
//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//Show, update, and destroy routes
router.route("/:id")
	.get(wrapAsync(listingController.showListing))
	.patch(isLoggedIn,isOwner,upload.single("listing[image][url]"),validateListing,wrapAsync(listingController.updateListing))
	.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

module.exports=router;