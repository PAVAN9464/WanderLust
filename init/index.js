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
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:"6aba7f4d21883c8ec6d68347"
    }));
    await Listing.insertMany(initData.data);
}

initDB();