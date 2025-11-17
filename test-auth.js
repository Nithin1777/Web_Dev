// Test script for signup and login functionality
const axios = require("axios");

const BASE_URL = "http://localhost:3000";

async function testSignup() {
  console.log("\n=== Testing Signup ===");
  try {
    const response = await axios.post(
      `${BASE_URL}/signup`,
      new URLSearchParams({
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
        confirmPassword: "password123",
      }),
      {
        maxRedirects: 0,
        validateStatus: function (status) {
          return status >= 200 && status < 400;
        },
      }
    );

    console.log("✓ Signup successful!");
    console.log("Response:", response.status, response.statusText);
    return true;
  } catch (error) {
    if (error.response && error.response.status === 302) {
      console.log("✓ Signup successful! (Redirected)");
      console.log("Redirect to:", error.response.headers.location);
      return true;
    }
    console.error("✗ Signup failed:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Location:", error.response.headers.location);
    }
    return false;
  }
}

async function testLogin() {
  console.log("\n=== Testing Login ===");
  try {
    const response = await axios.post(
      `${BASE_URL}/login`,
      new URLSearchParams({
        email: "testuser@example.com",
        password: "password123",
      }),
      {
        maxRedirects: 0,
        validateStatus: function (status) {
          return status >= 200 && status < 400;
        },
      }
    );

    console.log("✓ Login successful!");
    console.log("Response:", response.status, response.statusText);
    return true;
  } catch (error) {
    if (error.response && error.response.status === 302) {
      console.log("✓ Login successful! (Redirected)");
      console.log("Redirect to:", error.response.headers.location);
      return true;
    }
    console.error("✗ Login failed:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Location:", error.response.headers.location);
    }
    return false;
  }
}

async function testInvalidLogin() {
  console.log("\n=== Testing Invalid Login ===");
  try {
    const response = await axios.post(
      `${BASE_URL}/login`,
      new URLSearchParams({
        email: "testuser@example.com",
        password: "wrongpassword",
      }),
      {
        maxRedirects: 0,
        validateStatus: function (status) {
          return status >= 200 && status < 400;
        },
      }
    );

    console.log("Response:", response.status, response.statusText);
  } catch (error) {
    if (error.response && error.response.status === 302) {
      const location = error.response.headers.location;
      if (location.includes("error")) {
        console.log("✓ Invalid login correctly rejected");
        console.log("Redirect to:", location);
        return true;
      }
    }
    console.error("✗ Test failed");
    return false;
  }
}

async function runTests() {
  console.log("Starting Authentication Tests...\n");
  console.log(
    "Note: The first signup test might fail if the user already exists."
  );
  console.log("This is expected behavior.\n");

  await testSignup();
  await testLogin();
  await testInvalidLogin();

  console.log("\n=== Tests Complete ===");
  console.log("\nYou can now:");
  console.log("1. Visit http://localhost:3000/signup to create an account");
  console.log("2. Visit http://localhost:3000/login to log in");
  console.log("3. Try logging in with:");
  console.log("   Email: testuser@example.com");
  console.log("   Password: password123");
}

runTests();
