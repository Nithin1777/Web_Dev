const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const db = require("./db/activities");
const userDb = require("./db/users");

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

// Session configuration
app.use(
  session({
    secret: "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Make user available in all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

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
    message: req.query.message || "",
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
  // Redirect if already logged in
  if (req.session.user) {
    return res.redirect("/");
  }

  res.render("login", {
    title: "Exploreo - Login",
    page: "login",
    error: req.query.error || "",
    message: req.query.message || "",
  });
});

// Signup page
app.get("/signup", (req, res) => {
  // Redirect if already logged in
  if (req.session.user) {
    return res.redirect("/");
  }

  res.render("signup", {
    title: "Exploreo - Sign Up",
    page: "signup",
    error: req.query.error || "",
  });
});

// Handle signup POST
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.redirect(
        "/signup?error=" + encodeURIComponent("All fields are required")
      );
    }

    if (password !== confirmPassword) {
      return res.redirect(
        "/signup?error=" + encodeURIComponent("Passwords do not match")
      );
    }

    if (password.length < 6) {
      return res.redirect(
        "/signup?error=" +
          encodeURIComponent("Password must be at least 6 characters")
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await userDb.createUser({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Auto-login after signup
    req.session.user = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    res.redirect(
      "/?message=" + encodeURIComponent("Account created successfully!")
    );
  } catch (err) {
    console.error("Signup error:", err);

    if (err.message.includes("already exists")) {
      return res.redirect(
        "/signup?error=" + encodeURIComponent("Email already registered")
      );
    }

    res.redirect(
      "/signup?error=" +
        encodeURIComponent("Failed to create account. Please try again.")
    );
  } finally {
    await userDb.close();
  }
});

// Handle login POST
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.redirect(
        "/login?error=" + encodeURIComponent("Email and password are required")
      );
    }

    // Find user
    const user = await userDb.findUserByEmail(email.toLowerCase());

    if (!user) {
      return res.redirect(
        "/login?error=" + encodeURIComponent("Invalid email or password")
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.redirect(
        "/login?error=" + encodeURIComponent("Invalid email or password")
      );
    }

    // Create session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.redirect(
      "/?message=" + encodeURIComponent("Welcome back, " + user.name + "!")
    );
  } catch (err) {
    console.error("Login error:", err);
    res.redirect(
      "/login?error=" + encodeURIComponent("Login failed. Please try again.")
    );
  } finally {
    await userDb.close();
  }
});

// Handle logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect(
      "/login?message=" + encodeURIComponent("Logged out successfully")
    );
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
    if (
      !activityData.name ||
      !activityData.location ||
      !activityData.category
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, location, category",
      });
    }

    // Ensure seasonal_months is an array
    if (
      activityData.seasonal_months &&
      typeof activityData.seasonal_months === "string"
    ) {
      activityData.seasonal_months = activityData.seasonal_months
        .split(",")
        .map((m) => m.trim());
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
    if (
      updateData.seasonal_months &&
      typeof updateData.seasonal_months === "string"
    ) {
      updateData.seasonal_months = updateData.seasonal_months
        .split(",")
        .map((m) => m.trim());
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
  console.log(`\n Seasonal Travel Planner Server is running!`);
  console.log(` Local: http://localhost:${PORT}`);
});
