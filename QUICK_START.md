# 🚀 Quick Start Guide - Seasonal Travel Planner

Follow these steps to get your Seasonal Travel Planner up and running!

## Step 1: Verify MongoDB is Running

Open a PowerShell terminal and check if MongoDB is running:

```powershell
mongosh
```

If MongoDB is not running, start it with:

```powershell
# Start MongoDB service
net start MongoDB
```

Or if using MongoDB Community Edition manually:

```powershell
mongod
```

## Step 2: Populate the Database (First Time Only)

Run the seed data script to populate your database with sample activities:

```powershell
node seed-data.js
```

This will create 20+ sample activities across multiple destinations (Bali, Paris, Tokyo, New York, Singapore, London).

**If you already have data and want to replace it:**

```powershell
node seed-data.js replace
```

## Step 3: Test the Command-Line Tool

Try the CLI tool to verify the data is loaded correctly:

```powershell
# Search for activities in Bali during February
node mongo-cli.js Bali February

# Search for activities in Paris during June
node mongo-cli.js Paris June

# Search for all activities in Tokyo
node mongo-cli.js Tokyo
```

You should see formatted output with activity details!

## Step 4: Start the Web Server

```powershell
npm start
```

You should see:

```
🚀 Seasonal Travel Planner Server is running!
📍 Local: http://localhost:3000

📋 Available routes:
   - http://localhost:3000/ (Home)
   - http://localhost:3000/destinations (Destinations)
   - http://localhost:3000/activities (Activity Search)

📡 API endpoints:
   - GET /api/activities/search?location=Bali&month=February
   - GET /api/activities/all
   - GET /api/locations
```

## Step 5: Test the Web Application

Open your browser and visit:

### 🏠 Home Page
http://localhost:3000/

- Beautiful hero section with search functionality
- Enter a location and month
- Click "Search Activities"

### 🗺️ Destinations Page
http://localhost:3000/destinations

- Browse featured destinations
- Click "View Activities" for each destination
- See beautiful cards with destination info

### 🔍 Activity Search Page
http://localhost:3000/activities

- Advanced search form
- Filter by location and/or month
- See detailed activity cards with:
  - Activity name and category
  - Description
  - Location
  - Available months
  - Price (if applicable)

### Quick Search Examples:
- http://localhost:3000/activities?location=Bali&month=February
- http://localhost:3000/activities?location=Paris&month=June
- http://localhost:3000/activities?location=Tokyo

## Step 6: Test the API Endpoints

Open your browser or use a tool like Postman/cURL:

### Search Activities
```
http://localhost:3000/api/activities/search?location=Bali&month=February
```

Returns JSON:
```json
{
  "success": true,
  "count": 4,
  "location": "Bali",
  "month": "February",
  "data": [...]
}
```

### Get All Activities
```
http://localhost:3000/api/activities/all
```

### Get All Locations
```
http://localhost:3000/api/locations
```

## 🎉 Success!

If you can see the web pages and get results from your searches, congratulations! Your Seasonal Travel Planner is working perfectly!

## 🐛 Troubleshooting

### Problem: "Collection is empty" message

**Solution:** Run the seed data script:
```powershell
node seed-data.js
```

### Problem: "Cannot connect to MongoDB"

**Solution:** 
1. Verify MongoDB is running: `mongosh`
2. Check the connection string in `db/activities.js`
3. Ensure MongoDB is listening on port 27017

### Problem: "Port 3000 is already in use"

**Solution:** 
1. Stop the other process using port 3000
2. Or change the port in `server.js`:
   ```javascript
   const PORT = process.env.PORT || 3001;
   ```

### Problem: Module not found errors

**Solution:** Reinstall dependencies:
```powershell
npm install
```

## 🎓 Next Steps

1. **Customize the data:** Edit `seed-data.js` to add your own activities
2. **Modify the design:** Update `public/css/style.css`
3. **Add new features:** 
   - User authentication
   - Favorite activities
   - Booking system
   - Reviews and ratings
4. **Deploy:** Consider deploying to Heroku, Vercel, or another platform

## 📚 Documentation

For detailed documentation, see the main `README.md` file.

## 🎯 Key Features Implemented

✅ User input handling (location + month)
✅ MongoDB integration with TRAVEL database
✅ Query logic using $regex and array matching
✅ Structured, readable output
✅ Command-line tool support
✅ RESTful API with JSON responses
✅ EJS template engine with partials
✅ Responsive, modern design
✅ Error handling and validation

---

**Happy Traveling! ✈️🌍**
