const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB using mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Connected');
}).catch((err) => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Use the existing "PasswordManager" database and "Passwords" collection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define a schema for the passwords
const passwordSchema = new mongoose.Schema({
    site: { type: [String], required: true },
    username: { type: [String], required: true },
    password: { type: [String], required: true }
  });
  

// Create a model based on the schema
const Password = mongoose.model('Password', passwordSchema, 'Passwords');

// Routes
app.get('/', async (req, res) => {
  try {
    const passwords = await Password.find();
    res.json(passwords);
  } catch (error) {
    console.error('Error fetching passwords:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/', async (req, res) => {
  try {
    const { site, username, password } = req.body;
    const newPassword = new Password({ site, username, password });
    await newPassword.save();
    res.json({ success: true, passwordStatus: 'Saved successfully', result: newPassword });
  } catch (error) {
    console.error('Error saving password:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/', async (req, res) => {
  try {
    const deleteResult = await Password.deleteOne({ _id: req.body.id });
    res.json({ success: true, passwordStatus: 'Deleted successfully', result: deleteResult });
  } catch (error) {
    console.error('Error deleting password:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});