const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const main = async () => {
    try {
        await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to DB");

        await initDB(); // Call initDB only after connection is successful
        mongoose.connection.close(); // Close connection after seeding
    } catch (err) {
        console.error("Database connection error:", err);
    }
};

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        await Listing.insertMany(initData.data || initData); // Handle different export styles
        console.log("Data was initialized");
    } catch (err) {
        console.error("Error initializing data:", err);
    }
};

main();
