# Seasonal Travel Planner

A comprehensive Node.js web application that provides context-aware activity recommendations based on location and season, integrated with MongoDB.

## 🌟 Features

- **Seasonal Activity Search**: Find activities based on destination and month
- **MongoDB Integration**: Query the TRAVEL database for activity recommendations
- **RESTful API**: JSON endpoints for programmatic access
- **EJS Templates**: Server-side rendering with reusable partials (header, footer, navbar)
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Command-Line Tool**: Query activities directly from the terminal

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (v4.0 or higher) running on `localhost:27017`
- **TRAVEL database** with an `activities` collection

## 🚀 Installation

1. **Install Dependencies**

```powershell
npm install
```

This will install:
- `express` - Web server framework
- `ejs` - Template engine
- `mongodb` - MongoDB driver
- `body-parser` - Request body parsing

2. **Ensure MongoDB is Running**

Make sure MongoDB is running on `localhost:27017` with the TRAVEL database populated.

## 📁 Project Structure

```
Web Dev/
├── server.js                 # Express server (main application)
├── mongo.js                  # Original MongoDB query script
├── mongo-cli.js             # Enhanced CLI tool with user input
├── package.json             # Dependencies and scripts
├── db/
│   └── activities.js        # MongoDB module (exported functions)
├── views/                   # EJS templates
│   ├── index.ejs           # Home page
│   ├── destinations.ejs    # Destinations page
│   ├── activities.ejs      # Activity search page
│   ├── login.ejs           # Login page
│   ├── error.ejs           # Error page
│   └── partials/           # Reusable components
│       ├── header.ejs      # Common header
│       ├── navbar.ejs      # Navigation menu
│       └── footer.ejs      # Footer
├── public/                  # Static assets
│   └── css/
│       └── style.css       # Application styles
└── HTML/                    # Original HTML files (legacy)
```

## 🎯 Usage

### Web Application

1. **Start the Server**

```powershell
npm start
```

Or for development with auto-reload:

```powershell
npm run dev
```

2. **Access the Application**

Open your browser and navigate to:
- Home: `http://localhost:3000/`
- Destinations: `http://localhost:3000/destinations`
- Activity Search: `http://localhost:3000/activities`

3. **Search for Activities**

- Enter a location (e.g., "Bali", "Paris", "Tokyo")
- Select a month (or leave blank for all months)
- Click "Search Activities"

### Command-Line Tool

Query activities directly from the terminal:

```powershell
# Search with default values (Bali, February)
node mongo-cli.js

# Search for a specific location and month
node mongo-cli.js Paris June

# Search for all months in a location
node mongo-cli.js Tokyo

# Search for a specific month across all locations
node mongo-cli.js "" March
```

### API Endpoints

The application provides RESTful API endpoints that return JSON:

**Search Activities**
```
GET /api/activities/search?location=Bali&month=February
```

Response:
```json
{
  "success": true,
  "count": 5,
  "location": "Bali",
  "month": "February",
  "data": [
    {
      "name": "Temple Tour",
      "description": "Visit ancient temples...",
      "location": "Ubud, Bali",
      "seasonal_months": ["January", "February", "March"],
      "category": "Cultural",
      "price": 50
    }
  ]
}
```

**Get All Activities**
```
GET /api/activities/all
```

**Get Unique Locations**
```
GET /api/locations
```

## 🎨 Template Engine (EJS)

The application uses **EJS (Embedded JavaScript)** as the template engine to:

- **Avoid Code Duplication**: Common elements (header, navbar, footer) are in partials
- **Server-Side Rendering**: Dynamic content generation with MongoDB data
- **Maintainability**: Update header/footer in one place, affects all pages

### Using Partials

In any EJS view:

```ejs
<%- include('partials/header') %>
<!-- Page content -->
<%- include('partials/navbar') %>
<!-- More content -->
<%- include('partials/footer') %>
```

## 📊 MongoDB Query Logic

The application uses MongoDB's powerful query operators:

```javascript
{
  location: { $regex: "Bali", $options: 'i' },  // Case-insensitive search
  seasonal_months: "February"                    // Array contains element
}
```

This matches documents where:
- `location` field contains the search term (partial match, case-insensitive)
- `seasonal_months` array contains the specified month

## 🛠️ Development

**File Structure Guidelines:**

- **Views**: Add new pages in `views/` with `.ejs` extension
- **Routes**: Add new routes in `server.js`
- **Styles**: Update `public/css/style.css`
- **Database**: Use functions from `db/activities.js`

**Adding a New Route:**

```javascript
app.get('/new-page', async (req, res) => {
  res.render('new-page', {
    title: 'New Page',
    page: 'new-page'
  });
});
```

**Creating a New View:**

```ejs
<%- include('partials/header') %>
</head>
<body>
  <div class="page-header">
    <%- include('partials/navbar') %>
  </div>
  
  <!-- Your content here -->
  
  <%- include('partials/footer') %>
```

## 🔧 Configuration

Update these values in `db/activities.js` if your MongoDB setup differs:

```javascript
const uri = "mongodb://localhost:27017";  // MongoDB connection string
const DB_NAME = "TRAVEL";                  // Database name
```

## 📝 Sample Data Structure

Your MongoDB `activities` collection should have documents like:

```json
{
  "name": "Temple Tour",
  "description": "Explore ancient Balinese temples",
  "location": "Ubud, Bali",
  "category": "Cultural",
  "seasonal_months": ["January", "February", "March", "April", "May"],
  "price": 50
}
```

## 🚨 Troubleshooting

**"Collection is empty" message:**
- Ensure you've inserted data into the `TRAVEL.activities` collection
- Check that MongoDB is running: `mongosh` or `mongo`
- Verify database name: `show dbs` in MongoDB shell

**Port 3000 already in use:**
- Change the port in `server.js`: `const PORT = 3001;`
- Or stop the process using port 3000

**Module not found errors:**
- Run `npm install` to install all dependencies
- Check that `node_modules` folder exists

## 📱 Responsive Design

The application is fully responsive with breakpoints at:
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [EJS Documentation](https://ejs.co/)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)
- [MongoDB Query Operators](https://docs.mongodb.com/manual/reference/operator/query/)

## 📄 License

This project is for educational purposes.

## 👤 Author

Created as part of the Seasonal Travel Planner project.

---

**Happy Traveling! ✈️🌍**
