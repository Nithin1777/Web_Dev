const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const db = require("./db/activities");

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/HTML", express.static(path.join(__dirname, "HTML")));

// Helper function to format activities for display
function formatActivities(activities) {
  return activities.map((activity) => ({
    ...activity,
    seasonal_months: activity.seasonal_months
      ? activity.seasonal_months.join(", ")
      : "N/A",
  }));
}

// Routes

// Home page
app.get("/", (req, res) => {
  res.render("index", {
    title: "Exploreo - Seasonal Travel Planner",
    page: "home",
  });
});

// Destinations page
app.get("/destinations", (req, res) => {
  res.render("destinations", {
    title: "Exploreo - Destinations",
    page: "destinations",
  });
});

// Activity search page
app.get("/activities", async (req, res) => {
  const { location, month } = req.query;

  try {
    let activities = [];
    let searchPerformed = false;
    let noResults = false;

    if (location || month) {
      searchPerformed = true;
      activities = await db.searchActivities(location, month);
      noResults = activities.length === 0;
    }

    res.render("activities", {
      title: "Exploreo - Activity Search",
      page: "activities",
      activities: formatActivities(activities),
      location: location || "",
      month: month || "",
      searchPerformed,
      noResults,
    });
  } catch (err) {
    console.error("Error rendering activities page:", err);
    res.status(500).render("error", {
      title: "Error",
      page: "error",
      message: "Failed to load activities. Please ensure MongoDB is running.",
    });
  }
});

// API Routes

// API: Search activities (returns JSON)
app.get("/api/activities/search", async (req, res) => {
  const { location, month } = req.query;

  try {
    const activities = await db.searchActivities(location, month);

    res.json({
      success: true,
      count: activities.length,
      location: location || "All",
      month: month || "All",
      data: activities,
    });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to search activities",
      error: err.message,
    });
  } finally {
    await db.close();
  }
});

// API: Get all activities
app.get("/api/activities/all", async (req, res) => {
  try {
    const activities = await db.getAllActivities();

    res.json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch activities",
      error: err.message,
    });
  } finally {
    await db.close();
  }
});

// API: Get unique locations
app.get("/api/locations", async (req, res) => {
  try {
    const locations = await db.getUniqueLocations();

    res.json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch locations",
      error: err.message,
    });
  } finally {
    await db.close();
  }
});

// Login page (placeholder)
app.get("/login", (req, res) => {
  res.render("login", {
    title: "Exploreo - Login",
    page: "login",
  });
});

// Admin page - Manage activities (CRUD operations)
app.get("/admin", async (req, res) => {
  try {
    const activities = await db.getAllActivities();
    res.render("admin", {
      title: "Exploreo - Admin Panel",
      page: "admin",
      activities: formatActivities(activities),
      message: req.query.message || "",
      error: req.query.error || "",
    });
  } catch (err) {
    console.error("Error rendering admin page:", err);
    res.status(500).render("error", {
      title: "Error",
      page: "error",
      message: "Failed to load admin panel. Please ensure MongoDB is running.",
    });
  }
});

// API: Create new activity
app.post("/api/activities", async (req, res) => {
  try {
    const activityData = req.body;
    
    // Validate required fields
    if (!activityData.name || !activityData.location || !activityData.category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, location, category",
      });
    }

    // Ensure seasonal_months is an array
    if (activityData.seasonal_months && typeof activityData.seasonal_months === 'string') {
      activityData.seasonal_months = activityData.seasonal_months.split(',').map(m => m.trim());
    }

    const newActivity = await db.createActivity(activityData);
    res.status(201).json({
      success: true,
      message: "Activity created successfully",
      data: newActivity,
    });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create activity",
      error: err.message,
    });
  } finally {
    await db.close();
  }
});

// API: Update activity by ID
app.put("/api/activities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Ensure seasonal_months is an array
    if (updateData.seasonal_months && typeof updateData.seasonal_months === 'string') {
      updateData.seasonal_months = updateData.seasonal_months.split(',').map(m => m.trim());
    }

    const result = await db.updateActivity(id, updateData);
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    res.json({
      success: true,
      message: "Activity updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update activity",
      error: err.message,
    });
  } finally {
    await db.close();
  }
});

// API: Delete activity by ID
app.delete("/api/activities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.deleteActivity(id);
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    res.json({
      success: true,
      message: "Activity deleted successfully",
    });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete activity",
      error: err.message,
    });
  } finally {
    await db.close();
  }
});

// API: Get activity by ID
app.get("/api/activities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await db.getActivityById(id);
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    res.json({
      success: true,
      data: activity,
    });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity",
      error: err.message,
    });
  } finally {
    await db.close();
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("error", {
    title: "404 - Page Not Found",
    page: "error",
    message: "The page you are looking for does not exist.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Seasonal Travel Planner Server is running!`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`\n📋 Available routes:`);
  console.log(`   - http://localhost:${PORT}/ (Home)`);
  console.log(`   - http://localhost:${PORT}/destinations (Destinations)`);
  console.log(`   - http://localhost:${PORT}/activities (Activity Search)`);
  console.log(`   - http://localhost:${PORT}/admin (Admin Panel - CRUD)`);
  console.log(`\n📡 API endpoints:`);
  console.log(`   - GET /api/activities/search?location=X&month=Y`);
  console.log(`   - GET /api/activities/all`);
  console.log(`   - GET /api/activities/:id`);
  console.log(`   - POST /api/activities (Create)`);
  console.log(`   - PUT /api/activities/:id (Update)`);
  console.log(`   - DELETE /api/activities/:id (Delete)`);
  console.log(`   - GET /api/locations`);
  console.log(`\nPress Ctrl+C to stop the server.\n`);
});
