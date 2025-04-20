
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files from the public directory
app.use(express.static('public'));

// Proxy endpoint for weather API
app.get('/api/weather', async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          q: city,
          units: 'metric',
          appid: process.env.OPENWEATHER_API_KEY
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.message || 'An error occurred fetching weather data' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});