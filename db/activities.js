const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const DB_NAME = "TRAVEL";

/**
 * Connect to MongoDB
 */
async function connect() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    return client.db(DB_NAME);
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  }
}

/**
 * Close MongoDB connection
 */
async function close() {
  try {
    await client.close();
    console.log("MongoDB connection closed.");
  } catch (err) {
    console.error("Error closing connection:", err);
  }
}

/**
 * Search for activities based on location and month
 * @param {string} location - Target location (e.g., "Bali")
 * @param {string} month - Target month (e.g., "February")
 * @returns {Array} Array of matching activities
 */
async function searchActivities(location, month) {
  try {
    const db = await connect();
    const activities = db.collection("activities");

    // Build query based on provided parameters
    const query = {};

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (month) {
      query.seasonal_months = month;
    }

    const results = await activities.find(query).toArray();

    return results;
  } catch (err) {
    console.error("Error searching activities:", err);
    throw err;
  }
}

/**
 * Get all activities from the database
 * @returns {Array} Array of all activities
 */
async function getAllActivities() {
  try {
    const db = await connect();
    const activities = db.collection("activities");
    const results = await activities.find({}).toArray();
    return results;
  } catch (err) {
    console.error("Error fetching all activities:", err);
    throw err;
  }
}

/**
 * Get the count of documents in the activities collection
 * @returns {number} Document count
 */
async function getActivityCount() {
  try {
    const db = await connect();
    const activities = db.collection("activities");
    const count = await activities.countDocuments({});
    return count;
  } catch (err) {
    console.error("Error counting activities:", err);
    throw err;
  }
}

/**
 * Get unique locations from the database
 * @returns {Array} Array of unique locations
 */
async function getUniqueLocations() {
  try {
    const db = await connect();
    const activities = db.collection("activities");
    const locations = await activities.distinct("location");
    return locations;
  } catch (err) {
    console.error("Error fetching unique locations:", err);
    throw err;
  }
}

/**
 * Create a new activity in the database
 * @param {Object} activityData - Activity data to create
 * @returns {Object} Created activity with ID
 */
async function createActivity(activityData) {
  try {
    const db = await connect();
    const activities = db.collection("activities");
    const result = await activities.insertOne(activityData);
    return { _id: result.insertedId, ...activityData };
  } catch (err) {
    console.error("Error creating activity:", err);
    throw err;
  }
}

/**
 * Update an existing activity in the database
 * @param {string} id - Activity ID to update
 * @param {Object} updateData - Data to update
 * @returns {Object} Update result
 */
async function updateActivity(id, updateData) {
  try {
    const db = await connect();
    const activities = db.collection("activities");
    const { ObjectId } = require("mongodb");
    const result = await activities.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return result;
  } catch (err) {
    console.error("Error updating activity:", err);
    throw err;
  }
}

/**
 * Delete an activity from the database
 * @param {string} id - Activity ID to delete
 * @returns {Object} Delete result
 */
async function deleteActivity(id) {
  try {
    const db = await connect();
    const activities = db.collection("activities");
    const { ObjectId } = require("mongodb");
    const result = await activities.deleteOne({ _id: new ObjectId(id) });
    return result;
  } catch (err) {
    console.error("Error deleting activity:", err);
    throw err;
  }
}

/**
 * Get a single activity by ID
 * @param {string} id - Activity ID
 * @returns {Object} Activity object
 */
async function getActivityById(id) {
  try {
    const db = await connect();
    const activities = db.collection("activities");
    const { ObjectId } = require("mongodb");
    const activity = await activities.findOne({ _id: new ObjectId(id) });
    return activity;
  } catch (err) {
    console.error("Error fetching activity by ID:", err);
    throw err;
  }
}

module.exports = {
  connect,
  close,
  searchActivities,
  getAllActivities,
  getActivityCount,
  getUniqueLocations,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivityById,
};
