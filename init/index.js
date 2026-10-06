const mongoose=require("mongoose");
require("dotenv").config();
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const initData=require("./data.js");
const Listing=require("../models/Listing");

const MONGO_URL=process.env.ATLAS_URL;
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mapToken ? mbxGeoCoding({accessToken:mapToken}) : null;

main()
    .catch(err => {
        console.error("Database initialization failed:",err.message);
        process.exitCode=1;
    })
    .finally(() => mongoose.disconnect());

async function main() {
    if(!geocodingClient){
        throw new Error("MAP_TOKEN is not configured");
    }
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected!");
    await initDB();
}

const geocodeListing=async ({location,country})=>{
    const response=await geocodingClient.forwardGeocode({
        query:`${location}, ${country}`,
        limit:1,
    }).send();
    const geometry=response.body.features[0]?.geometry;
    if(geometry?.type !== "Point" || !Array.isArray(geometry.coordinates)){
        throw new Error(`Could not find coordinates for ${location}, ${country}`);
    }
    return geometry;
};

const initDB= async ()=>{
    const listings=await Promise.all(initData.data.map(async (obj)=>(
        {
            ...obj,
            owner:"6ac222bef48170df126984b2",
            geometry:await geocodeListing(obj),
        }
    )));
    await Listing.deleteMany({});
    await Listing.insertMany(listings);
    console.log(`${listings.length} listings initialized.`);
};
