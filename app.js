const express=require("express");
const app=express();
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const Listing=require("./models/Listing")
const path=require("path");
const ejsMate=require("ejs-mate");
const PORT=8080;

const MONGO_URL="mongodb://127.0.0.1:27017/Wanderlust";
main().catch(err => console.log(err));


async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected!");
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));


app.get("/",(req,res)=>{
    res.send("At root directory");
});

//Index Route
app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({});
   // console.log(allListings);
    res.render("listings/index.ejs",{allListings});
    
});

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Create new Route

app.post("/listings",async (req,res)=>{
    
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    

})

//Edit Route
app.get("/listings/:id/edit",async (req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//Update Route
app.patch("/listings/:id",async (req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing);
    res.redirect(`/listings/${id}`);
});

//Destroy Route
app.delete("/listings/:id",async (req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

//Show Route
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});

})

// app.get("/ListingTest",async (req,res)=>{
//         let sample=new Listing({
//             title:"Beach",
//             description:"Maya Beach Goa",
//             price:1500,
//             location:"Goa",
//             country:"India",

//         })
//         await sample.save().catch((err)=>console.log(err));
//         res.send("Saved Successfuly");
// })
app.listen(PORT, (req,res)=>{
    console.log("Listening to Port");
});