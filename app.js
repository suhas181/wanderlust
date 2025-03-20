
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const expressLayouts = require("express-ejs-layouts");

app.use(expressLayouts);
app.set("layout", "layouts/boilerplate"); // Set default layout


app.use(methodOverride("_method"));  // <-- Add this line after initializing `app`
app.use(express.urlencoded({ extended: true }));




const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; // MongoDB connection URL

main().then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
//app.use(expressLayouts);

// app.engine("ejs", ejsMate); // Use ejs-mate
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));



// ✅ Add this route here:
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings }); // Pass allListings to EJS
});

// Root Route
app.get("/", (req, res) => {
    res.send("Hi, I am suhas");
});

// Index Route - Show all listings
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
});

// New Route - Show form to create new listing
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});


// Create Route - Handle form submission
app.post("/listings", async (req, res) => {
    try {
        console.log("Received Data:", req.body); // Debugging step

        const newListing = new Listing(req.body.listing);
        await newListing.save();

        res.redirect("/listings");
    } catch (err) {
        console.error("Error Saving Listing:", err);
        res.status(400).send("Error: Required fields are missing.");
    }
});


// Edit Route - Show edit form for a listing
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id); // Fetch the correct listing

    if (!listing) {
        return res.status(404).send("Listing not found");
    }

    res.render("listings/edit.ejs", { listing }); // Pass the listing to the template
});


// Show Route - Show details of a single listing
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).send("Listing not found");
    }
    res.render("listings/show", { listing });
});
// app.delete("/listings/:id", async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// });

app.delete('/listings/:id', async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
});
app.get("/listings", (req, res) => {
    res.render("listings/index"); // Make sure this file exists: views/listings/index.ejs
});


// Start Server
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});



