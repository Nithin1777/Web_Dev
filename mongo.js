const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");

    // Using the database name "TRAVEL" as specified by you.
    const db = client.db("TRAVEL"); 
    const activities = db.collection("activities");

    // --- DEBUG STEP: Check document count ---
    const totalCount = await activities.countDocuments({});
    console.log(`\n[DEBUG] Total documents found in 'TRAVEL.activities': ${totalCount}`);
    if (totalCount === 0) {
        console.log("[DEBUG] The collection is empty. The issue is likely that the data was not inserted into this specific database yet.");
    }
    // ----------------------------------------

    const month = "February";
    const locationQuery = "Bali";

    // MongoDB Query: Find documents where 'location' contains "Bali" AND 
    // the 'seasonal_months' array contains "February".
    const baliFebruaryActivities = await activities.find({
        // $regex ensures we match "Ubud, Bali" or "South Bali" (case-insensitive 'i')
        location: { $regex: locationQuery, $options: 'i' }, 
        // Array matching (exact match for "February" within the array)
        seasonal_months: month 
    }).toArray();

    console.log(`\n--- Activities in ${locationQuery} during ${month} ---`);
    console.log(baliFebruaryActivities);
    console.log("-------------------------------------------\n");


  } catch (err) {
    console.error("An error occurred during the MongoDB operation:", err);
  } finally {
    await client.close();
    console.log("Connection closed.");
  }
}

run();