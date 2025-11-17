const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "TRAVEL";

// Helper function to get database connection
async function getDb() {
  await client.connect();
  return client.db(dbName);
}

// Create a new user
async function createUser(userData) {
  try {
    const db = await getDb();
    const users = db.collection("users");

    // Check if user already exists
    const existingUser = await users.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create user document
    const user = {
      name: userData.name,
      email: userData.email,
      password: userData.password, // In production, this should be hashed!
      createdAt: new Date(),
      role: userData.role || "user",
    };

    const result = await users.insertOne(user);
    return { _id: result.insertedId, ...user };
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
}

// Find user by email
async function findUserByEmail(email) {
  try {
    const db = await getDb();
    const users = db.collection("users");
    return await users.findOne({ email });
  } catch (err) {
    console.error("Error finding user:", err);
    throw err;
  }
}

// Authenticate user (login)
async function authenticateUser(email, password) {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // In production, compare hashed passwords
    if (user.password !== password) {
      return { success: false, message: "Invalid password" };
    }

    // Don't return password
    const { password: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } catch (err) {
    console.error("Error authenticating user:", err);
    throw err;
  }
}

// Get user by ID
async function getUserById(userId) {
  try {
    const db = await getDb();
    const users = db.collection("users");
    const user = await users.findOne({ _id: new ObjectId(userId) });

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  } catch (err) {
    console.error("Error getting user:", err);
    throw err;
  }
}

// Update user
async function updateUser(userId, updateData) {
  try {
    const db = await getDb();
    const users = db.collection("users");

    // Remove fields that shouldn't be updated directly
    const { _id, createdAt, ...allowedUpdates } = updateData;

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { ...allowedUpdates, updatedAt: new Date() } }
    );

    return result;
  } catch (err) {
    console.error("Error updating user:", err);
    throw err;
  }
}

// Get all users (admin function)
async function getAllUsers() {
  try {
    const db = await getDb();
    const users = db.collection("users");
    const allUsers = await users.find({}).toArray();

    // Remove passwords from results
    return allUsers.map((user) => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  } catch (err) {
    console.error("Error getting users:", err);
    throw err;
  }
}

// Close database connection
async function close() {
  try {
    await client.close();
  } catch (err) {
    console.error("Error closing connection:", err);
  }
}

module.exports = {
  createUser,
  findUserByEmail,
  authenticateUser,
  getUserById,
  updateUser,
  getAllUsers,
  close,
};
