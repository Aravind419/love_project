const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const path = require('path');
require('dotenv').config(); // Load environment variables from a .env file

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Define a User schema and model
const userSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String
});

const User = mongoose.model('User', userSchema);

// API route to handle user data submission
app.post('/api/users', async (req, res) => {
    const { name, phoneNumber } = req.body;

    if (!name || !phoneNumber) {
        return res.status(400).json({ message: 'Name and phone number are required' });
    }

    try {
        const newUser = new User({ name, phoneNumber });
        await newUser.save();
        res.status(201).json({ message: 'User saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving user data', error });
    }
});

// Start the server
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
