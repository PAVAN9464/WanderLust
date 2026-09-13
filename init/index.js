const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/Listing");

const MONGO_URL="mongodb://127.0.0.1:27017/Wanderlust";
main().catch(err => console.log(err));


async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected!");
}

const initDB= async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
}

initDB();