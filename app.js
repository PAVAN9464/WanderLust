const express=require("express");
const app=express();
const mongoose=require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/Wanderlust";
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected!");
}

app.get("/",(req,res)=>{
    res.send("At root directory");
})
app.listen(8080, (req,res)=>{
    console.log("Listening to Port");
});
