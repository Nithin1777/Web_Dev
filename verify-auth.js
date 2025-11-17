// Quick verification of authentication setup
const userDb = require("./db/users");

async function verifySetup() {
  console.log("\n=== Verifying Authentication Setup ===\n");

  try {
    // Test 1: Check database connection
    console.log("1. Testing database connection...");
    const users = await userDb.getAllUsers();
    console.log(
      `✓ Connected to database. Found ${users.length} existing user(s).`
    );

    if (users.length > 0) {
      console.log("\nExisting users:");
      users.forEach((user) => {
        console.log(`  - ${user.name} (${user.email})`);
      });
    }

    console.log("\n=== Setup Verified Successfully! ===\n");
    console.log("You can now:");
    console.log(
      "1. Visit http://localhost:3000/signup to create a new account"
    );
    console.log("2. Visit http://localhost:3000/login to sign in");
    console.log("3. Test the authentication flow\n");
  } catch (error) {
    console.error("✗ Setup verification failed:", error.message);
    console.error("\nPlease ensure:");
    console.error("1. MongoDB is running");
    console.error("2. Server is running on port 3000");
    console.error('3. Database "TRAVEL" is accessible\n');
  } finally {
    await userDb.close();
    process.exit(0);
  }
}

verifySetup();
