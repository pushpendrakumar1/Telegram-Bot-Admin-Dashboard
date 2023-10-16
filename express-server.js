const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const expressSession = require('express-session');
const crypto = require('crypto');
const database = require('./db/database'); // Import your database module

const app = express();
const port = process.env.PORT || 4000;





// Generate a random secret key (replace with a longer, more complex key)
const secretKey = crypto.randomBytes(32).toString('hex');
console.log('Generated secret key:', secretKey);

// Initialize express-session middleware with the generated secret key
app.use(
  expressSession({
    secret: secretKey,
    resave: true,
    saveUninitialized: true,
  })
);

// Initialize Passport and session management
app.use(passport.initialize());
app.use(passport.session());

// Configure the Google OAuth 2.0 strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: '480438182457-l674lrt5pmfidt8r9rv3ohjt1pvjhgkj.apps.googleusercontent.com', // Replace with your Client ID
      clientSecret: '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', // Replace with your Client Secret
      callbackURL: 'http://localhost:3000/auth/google/callback', // Adjust as needed
    },
    (accessToken, refreshToken, profile, done) => {
      // This function will handle the user's profile after successful login
      // You can save user information to the database here
      return done(null, profile);
    }
  )
);

// Serialize and deserialize user sessions
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Define a route for the admin login page
app.get('/admin/login', (req, res) => {
  res.sendFile(__dirname + '/login.html'); // Replace with the path to your login HTML file
});

// Handle the login form submission
app.post('/admin/login', passport.authenticate('google', { failureRedirect: '/admin/login' }), (req, res) => {
  // Redirect to the admin dashboard upon successful login
  res.redirect('/admin/dashboard');
});

// Define a route to display subscriber details on the admin dashboard
app.get('/admin/dashboard', (req, res) => {
  // Render the dashboard.html page
  res.sendFile(__dirname + '/dashboard.html');
});

// Serve subscriber data as JSON through an API endpoint
app.get('/admin/dashboard/subscribers', async (req, res) => {
  try {
    const subscribers = await database.getSubscribers(); // Implement this function to fetch subscribers from the database
    res.json(subscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ error: 'An error occurred while fetching subscribers.' });
  }
});

// Implement a route to delete a subscriber by their username
app.delete('/admin/dashboard/subscribers/:username', async (req, res) => {
  const username = req.params.username;

  try {
    await database.deleteSubscriber(username);
    res.sendStatus(204); // No Content (successful deletion)
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    res.status(500).json({ error: 'An error occurred while deleting the subscriber.' });
  }
});

// Define a route for the root path
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start the Express app
app.listen(port, () => console.log(`Server is listening on port ${port}`));

module.exports = app;
