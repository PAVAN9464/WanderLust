const mongoose = require("mongoose");
require("dotenv").config();
const Listing = require("../models/Listing");

const MONGO_URL = process.env.ATLAS_URL;

const VALID_CATEGORIES = [
    "Beach",
    "Mountain",
    "City",
    "Countryside",
    "Luxury",
    "Cabin",
    "Villa"
];

function inferCategory(listing) {
    const text = `${listing.title || ""} ${listing.description || ""} ${listing.location || ""}`.toLowerCase();
    if (text.includes("beach") || text.includes("ocean") || text.includes("coast") || text.includes("sea") || text.includes("island") || text.includes("surf")) {
        return "Beach";
    }
    if (text.includes("mountain") || text.includes("ski") || text.includes("alps") || text.includes("chalet") || text.includes("hill") || text.includes("peak")) {
        return "Mountain";
    }
    if (text.includes("cabin") || text.includes("lake") || text.includes("treehouse") || text.includes("camp") || text.includes("log") || text.includes("wood")) {
        return "Cabin";
    }
    if (text.includes("villa")) {
        return "Villa";
    }
    if (text.includes("luxury") || text.includes("penthouse") || text.includes("resort") || text.includes("castle") || text.includes("palace")) {
        return "Luxury";
    }
    if (text.includes("countryside") || text.includes("cottage") || text.includes("farm") || text.includes("rural") || text.includes("cotswolds") || text.includes("serengeti")) {
        return "Countryside";
    }
    if (text.includes("city") || text.includes("downtown") || text.includes("apartment") || text.includes("loft") || text.includes("urban")) {
        return "City";
    }
    return "City";
}

async function migrate() {
    if (!MONGO_URL) {
        console.error("Error: ATLAS_URL is not configured in .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB Atlas.");

        const unmigratedListings = await Listing.find({
            $or: [
                { category: { $exists: false } },
                { category: null },
                { category: "" },
                { category: { $nin: VALID_CATEGORIES } }
            ]
        });

        console.log(`Found ${unmigratedListings.length} listings needing category migration.`);

        if (unmigratedListings.length === 0) {
            console.log("All listings already have valid categories. No migration needed.");
            return;
        }

        let updatedCount = 0;
        for (const listing of unmigratedListings) {
            const assignedCategory = inferCategory(listing);
            await Listing.updateOne(
                { _id: listing._id },
                { $set: { category: assignedCategory } }
            );
            console.log(`- Updated "${listing.title}" (_id: ${listing._id}) -> ${assignedCategory}`);
            updatedCount++;
        }

        console.log(`Migration completed: Successfully updated ${updatedCount} listings.`);
    } catch (err) {
        console.error("Migration failed:", err.message);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
}

migrate();
