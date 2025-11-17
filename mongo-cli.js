const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

/**
 * Main function to query activities based on location and month
 * Supports command-line arguments:
 *   node mongo.js [location] [month]
 * Examples:
 *   node mongo.js Bali February
 *   node mongo.js Paris June
 *   node mongo.js Tokyo
 */
async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");

    // Using the database name "TRAVEL" as specified by you.
    const db = client.db("TRAVEL");
    const activities = db.collection("activities");

    // --- DEBUG STEP: Check document count ---
    const totalCount = await activities.countDocuments({});
    console.log(
      `\n[DEBUG] Total documents found in 'TRAVEL.activities': ${totalCount}`
    );
    if (totalCount === 0) {
      console.log(
        "[DEBUG] The collection is empty. The issue is likely that the data was not inserted into this specific database yet."
      );
      return;
    }
    // ----------------------------------------

    // Get arguments from command line or use defaults
    const args = process.argv.slice(2);
    const locationQuery = args[0] || "Bali";
    const month = args[1] || "February";

    console.log(`\n📍 Searching for activities...`);
    console.log(`   Location: ${locationQuery}`);
    console.log(`   Month: ${month}`);

    // Build query object
    const query = {};

    if (locationQuery) {
      query.location = { $regex: locationQuery, $options: "i" };
    }

    if (month) {
      query.seasonal_months = month;
    }

    // MongoDB Query: Find documents where 'location' contains the location AND
    // the 'seasonal_months' array contains the specified month.
    const results = await activities.find(query).toArray();

    console.log(`\n--- Activities in ${locationQuery} during ${month} ---`);
    console.log(`Found ${results.length} activities:\n`);

    if (results.length === 0) {
      console.log("❌ No activities found matching your criteria.");
      console.log("\nTry adjusting your search parameters:");
      console.log("  - Check the spelling of the location");
      console.log("  - Try a different month");
      console.log("  - Use broader search terms\n");
    } else {
      results.forEach((activity, index) => {
        console.log(`\n${index + 1}. ${activity.name}`);
        console.log(`   📍 Location: ${activity.location}`);
        console.log(`   📝 Description: ${activity.description}`);
        console.log(
          `   📅 Available: ${
            activity.seasonal_months
              ? activity.seasonal_months.join(", ")
              : "N/A"
          }`
        );
        if (activity.category)
          console.log(`   🏷️  Category: ${activity.category}`);
        if (activity.price) console.log(`   💰 Price: $${activity.price}`);
      });
    }

    console.log("\n-------------------------------------------\n");
  } catch (err) {
    console.error("❌ An error occurred during the MongoDB operation:", err);
  } finally {
    await client.close();
    console.log("Connection closed.");
  }
}

// Only run if this file is executed directly (not imported as a module)
if (require.main === module) {
  run();
}
