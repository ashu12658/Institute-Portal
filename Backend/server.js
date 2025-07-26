  const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const studentRoutes = require('./routes/studentRoutes');
const jobRoutes = require('./routes/jobRoutes');
const userRoutes = require('./routes/userRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const cors = require('cors');
const path = require('path');
// Load

dotenv.config(); // Load environment variables from .env file

// Initialize Express
const app = express();

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Middleware to parse incoming JSON requests
app.use(express.json());

app.use(
  cors({
    origin:  ['http://localhost:3000'],
     methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // if you're using cookies or tokens
  })
);


// MongoDB connection
  mongoose
    .connect("mongodb+srv://ashishghatol8:ashu2393@cluster0.6qtuvts.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("MongoDB connected successfully"))
    .catch((error) => {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    });

// Use the student routes
app.use('/api/students', studentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);

// Define a basic route
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Error handler for uncaught errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong' });
});

// Start the server on the configured port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
