const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const data = require("./data.js");

async function initDB() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");

  await Listing.deleteMany({});

  const sampleData = data.map((obj) => ({
    ...obj,
    owner: "6a3136bfa632e7bca683574c",
  }));

  await Listing.insertMany(sampleData);

  console.log("Database initialized");
}

initDB()
  .then(() => process.exit())
  .catch(console.error);
