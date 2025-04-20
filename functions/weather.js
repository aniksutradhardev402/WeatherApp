const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    // Get city from query parameters
    const params = event.queryStringParameters;
    const city = params.city;
    
    if (!city) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'City parameter is required' })
      };
    }
    
    // Call OpenWeatherMap API
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          q: city,
          units: 'metric',
          appid: process.env.OPENWEATHER_API_KEY
        }
      }
    );
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.log('Error:', error.response?.data || error.message);
    
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ 
        error: error.response?.data?.message || 'Error fetching weather data'
      })
    };
  }
};