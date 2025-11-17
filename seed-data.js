// Sample data for the TRAVEL.activities collection
// Run this file to populate your MongoDB database with sample activities

const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const DB_NAME = "TRAVEL";

const sampleActivities = [
  {
    name: "Temple Tour",
    description:
      "Visit ancient Balinese temples including Tanah Lot and Uluwatu. Experience traditional ceremonies and stunning architecture.",
    location: "Ubud, Bali",
    category: "Cultural",
    seasonal_months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    price: 50,
  },
  {
    name: "Rice Terrace Trek",
    description:
      "Hike through the famous Tegallalang rice terraces. Learn about traditional Balinese irrigation systems.",
    location: "Ubud, Bali",
    category: "Adventure",
    seasonal_months: ["April", "May", "June", "July", "August", "September"],
    price: 35,
  },
  {
    name: "Surfing Lessons",
    description:
      "Learn to surf at Kuta Beach with professional instructors. Perfect for beginners and intermediate surfers.",
    location: "Kuta, Bali",
    category: "Water Sports",
    seasonal_months: [
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
    ],
    price: 60,
  },
  {
    name: "Traditional Cooking Class",
    description:
      "Learn to cook authentic Balinese dishes. Visit local markets and prepare a full traditional meal.",
    location: "Seminyak, Bali",
    category: "Culinary",
    seasonal_months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    price: 45,
  },
  {
    name: "Eiffel Tower Visit",
    description:
      "Visit the iconic Eiffel Tower with skip-the-line tickets. Enjoy panoramic views of Paris from the top.",
    location: "Paris, France",
    category: "Sightseeing",
    seasonal_months: [
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
    ],
    price: 75,
  },
  {
    name: "Louvre Museum Tour",
    description:
      "Explore the world's largest art museum. See the Mona Lisa and other masterpieces with an expert guide.",
    location: "Paris, France",
    category: "Cultural",
    seasonal_months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "September",
      "October",
      "November",
      "December",
    ],
    price: 65,
  },
  {
    name: "Seine River Cruise",
    description:
      "Romantic evening cruise along the Seine River. See Paris's illuminated monuments from the water.",
    location: "Paris, France",
    category: "Romance",
    seasonal_months: ["April", "May", "June", "July", "August", "September"],
    price: 55,
  },
  {
    name: "Shibuya Crossing Experience",
    description:
      "Visit the world's busiest intersection. Explore Shibuya district with its trendy shops and cafes.",
    location: "Tokyo, Japan",
    category: "Urban",
    seasonal_months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    price: 25,
  },
  {
    name: "Mount Fuji Day Trip",
    description:
      "Full-day tour to Mount Fuji. Visit the 5th station and enjoy stunning views of Japan's iconic mountain.",
    location: "Tokyo, Japan",
    category: "Nature",
    seasonal_months: [
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
    ],
    price: 120,
  },
  {
    name: "Tsukiji Fish Market Tour",
    description:
      "Early morning visit to Tsukiji Outer Market. Sample fresh sushi and learn about Japanese seafood culture.",
    location: "Tokyo, Japan",
    category: "Culinary",
    seasonal_months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "September",
      "October",
      "November",
      "December",
    ],
    price: 40,
  },
  {
    name: "Cherry Blossom Viewing",
    description:
      "Experience hanami in Tokyo's beautiful parks. See cherry blossoms in full bloom.",
    location: "Tokyo, Japan",
    category: "Nature",
    seasonal_months: ["March", "April"],
    price: 30,
  },
  {
    name: "Broadway Show",
    description:
      "Watch a spectacular Broadway musical. Choose from the latest hit shows on the Great White Way.",
    location: "New York, USA",
    category: "Entertainment",
    seasonal_months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "September",
      "October",
      "November",
      "December",
    ],
    price: 150,
  },
  {
    name: "Statue of Liberty Tour",
    description:
      "Visit the iconic Statue of Liberty and Ellis Island. Learn about American immigration history.",
    location: "New York, USA",
    category: "Sightseeing",
    seasonal_months: [
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
    ],
    price: 85,
  },
  {
    name: "Central Park Bike Tour",
    description:
      "Explore Central Park on a guided bike tour. See famous landmarks and hidden gems.",
    location: "New York, USA",
    category: "Adventure",
    seasonal_months: [
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
    ],
    price: 55,
  },
  {
    name: "Metropolitan Museum Tour",
    description:
      "Discover world-class art at the Met. Guided tour through 5,000 years of artistic achievement.",
    location: "New York, USA",
    category: "Cultural",
    seasonal_months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "September",
      "October",
      "November",
      "December",
    ],
    price: 70,
  },
  {
    name: "Sentosa Island Adventure",
    description:
      "Full day at Sentosa Island. Enjoy beaches, attractions, and adventure activities.",
    location: "Singapore",
    category: "Entertainment",
    seasonal_months: [
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
    ],
    price: 90,
  },
  {
    name: "Gardens by the Bay",
    description:
      "Explore the futuristic gardens with giant Supertrees. Visit the Cloud Forest and Flower Dome.",
    location: "Singapore",
    category: "Nature",
    seasonal_months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    price: 45,
  },
  {
    name: "Hawker Center Food Tour",
    description:
      "Taste authentic Singaporean cuisine at famous hawker centers. Try local favorites with a guide.",
    location: "Singapore",
    category: "Culinary",
    seasonal_months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    price: 50,
  },
  {
    name: "Tower of London Tour",
    description:
      "Visit the historic Tower of London. See the Crown Jewels and learn about royal history.",
    location: "London, UK",
    category: "Cultural",
    seasonal_months: [
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
    ],
    price: 80,
  },
  {
    name: "Thames River Cruise",
    description:
      "Sightseeing cruise along the Thames River. See London's famous landmarks from the water.",
    location: "London, UK",
    category: "Sightseeing",
    seasonal_months: ["April", "May", "June", "July", "August", "September"],
    price: 40,
  },
];

async function populateDatabase() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB successfully!");

    const db = client.db(DB_NAME);
    const activities = db.collection("activities");

    // Check if collection already has data
    const existingCount = await activities.countDocuments({});

    if (existingCount > 0) {
      console.log(
        `\n⚠️  Collection already contains ${existingCount} documents.`
      );
      console.log("Do you want to:");
      console.log("  1. Add sample data anyway (may create duplicates)");
      console.log("  2. Clear existing data and insert fresh data");
      console.log("  3. Cancel operation");
      console.log("\nTo proceed, run:");
      console.log("  - To add anyway: node seed-data.js add");
      console.log("  - To replace all: node seed-data.js replace");

      const arg = process.argv[2];

      if (arg === "add") {
        const result = await activities.insertMany(sampleActivities);
        console.log(
          `\n✅ Successfully inserted ${result.insertedCount} new activities!`
        );
      } else if (arg === "replace") {
        await activities.deleteMany({});
        console.log(`\n🗑️  Deleted ${existingCount} existing documents.`);
        const result = await activities.insertMany(sampleActivities);
        console.log(
          `✅ Successfully inserted ${result.insertedCount} fresh activities!`
        );
      } else {
        console.log("\n❌ Operation cancelled.");
      }
    } else {
      // Collection is empty, insert data
      const result = await activities.insertMany(sampleActivities);
      console.log(
        `\n✅ Successfully inserted ${result.insertedCount} activities into ${DB_NAME}.activities!`
      );

      // Show summary
      console.log("\n📊 Summary:");
      const locations = await activities.distinct("location");
      console.log(`   - Unique locations: ${locations.length}`);
      console.log(`   - Total activities: ${result.insertedCount}`);

      console.log("\n🎯 Try these searches:");
      console.log("   - node mongo-cli.js Bali February");
      console.log("   - node mongo-cli.js Paris June");
      console.log("   - node mongo-cli.js Tokyo March");
      console.log("   - npm start (then visit http://localhost:3000)");
    }
  } catch (err) {
    console.error("❌ Error populating database:", err);
  } finally {
    await client.close();
    console.log("\n🔌 Connection closed.");
  }
}

populateDatabase();
