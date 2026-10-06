const Listing=require("../models/Listing");
const {cloudinary}=require("../cloudConfig");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const ExpressError=require("../utils/ExpressError");
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeoCoding({accessToken : mapToken});

const geocodeListing = async ({location,country}) => {
    if(!mapToken){
        throw new ExpressError(500,"Mapbox token is not configured");
    }

    const response=await geocodingClient.forwardGeocode({
        query:`${location}, ${country}`,
        limit:1,
    }).send();
    const feature=response.body.features[0];
    if(!feature){
        throw new ExpressError(400,"Could not find coordinates for this location and country");
    }
    return feature.geometry;
};

const hasValidGeometry = (geometry) => geometry?.type === "Point"
    && Array.isArray(geometry.coordinates)
    && geometry.coordinates.length === 2
    && geometry.coordinates.every(Number.isFinite);

module.exports.index=async (req,res)=>{
    const location=typeof req.query.location === "string"
        ? req.query.location.trim().slice(0,100)
        : "";
    const searchTerm=location.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const filter=location
        ? {
            $or: [
                {title: {$regex: searchTerm, $options: "i"}},
                {location: {$regex: searchTerm, $options: "i"}},
                {country: {$regex: searchTerm, $options: "i"}},
            ],
        }
        : {};
    const allListings=await Listing.find(filter);
    res.render("listings/index.ejs",{allListings,location});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.createListing=async (req,res)=>{
    const geometry=await geocodeListing(req.body.listing);
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=geometry;
    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("success","New Listing Created");
    res.redirect("/listings");
};

module.exports.renderEditForm=async (req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","The requested Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
};

module.exports.updateListing=async (req,res)=>{
    const {id}=req.params;
    const listingData={...req.body.listing};
    listingData.geometry=await geocodeListing(listingData);
    if(req.file){
        listingData.image={url:req.file.path,filename:req.file.filename};
    }
    await Listing.findByIdAndUpdate(id,listingData);
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    if(listing?.image?.filename && listing.image.filename !== "listingimage"){
        await cloudinary.uploader.destroy(listing.image.filename);
    }
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
};

module.exports.showListing=async (req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id)
        .populate({path:"reviews",populate:{path:"author"}})
        .populate("owner");
    if(!listing){
        req.flash("error","The requested Listing does not exist");
        return res.redirect("/listings");
    }
    let mapReady=hasValidGeometry(listing.geometry);
    if(!mapReady && mapToken && listing.location && listing.country){
        try{
            listing.geometry=await geocodeListing(listing);
            await Listing.updateOne({_id:listing._id},{$set:{geometry:listing.geometry}});
            mapReady=true;
        }catch(error){
            console.error(`Could not geocode listing ${listing._id}:`,error.message);
        }
    }
    res.render("listings/show.ejs",{listing,mapToken,mapReady});
};