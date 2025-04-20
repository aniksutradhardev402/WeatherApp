// No API key needed in frontend code anymore
const apiUrl = "/api/weather?city=";

const searchBox = document.querySelector(".search input");  
const searchBtn = document.querySelector(".search button");
const weatherInfo = document.querySelector(".weather");
const errorElement = document.createElement("p"); // Create error element
errorElement.className = "error";
document.querySelector(".card").appendChild(errorElement);

async function checkWeather(city) {
    try {
        // Clear previous error
        errorElement.innerText = "";
        
        // Show loading state
        weatherInfo.innerHTML = '<p>Loading...</p>';
        weatherInfo.style.display = "block";
        
        const response = await fetch(apiUrl + encodeURIComponent(city));
        const data = await response.json();
        
        if (response.status === 404 || data.cod === "404") {
            errorElement.innerText = "City not found!";
            weatherInfo.style.display = "none";
            return;
        }
        
        if (!response.ok) {
            throw new Error(data.error || 'Error fetching weather data');
        }
        
        // Update UI with weather data
        weatherInfo.innerHTML = `
            <i class="fa-solid fa-cloud"></i>
            <h1 class="temp">${Math.round(data.main.temp)}°C</h1>
            <h2 class="city">${data.name}</h2>
            <div class="details">
                <div class="col">
                    <i class="fa-solid fa-temperature-three-quarters"></i>
                    <p class="humidity">${data.main.humidity}%</p>
                </div>
                <div class="col">
                    <i class="fa-solid fa-wind"></i>
                    <p class="wind">${Math.round(data.wind.speed)} km/h</p>
                </div>
            </div>
        `;
        
        // Update weather icon
        const weatherIcon = weatherInfo.querySelector("i:first-child");
        
        switch (data.weather[0].main) {
            case "Clouds":
                weatherIcon.className = "fa-solid fa-cloud";
                break;
            case "Clear":
                weatherIcon.className = "fa-solid fa-sun";
                break;
            case "Rain":
                weatherIcon.className = "fa-solid fa-cloud-rain";
                break;
            case "Drizzle":
                weatherIcon.className = "fa-solid fa-cloud-showers-heavy";
                break;
            case "Mist":
                weatherIcon.className = "fa-solid fa-smog";
                break;
            case "Snow":
                weatherIcon.className = "fa-solid fa-snowflake";
                break;
            case "Thunderstorm":
                weatherIcon.className = "fa-solid fa-bolt";
                break;
            default:
                weatherIcon.className = "fa-solid fa-cloud";
        }
        
        weatherInfo.style.display = "block";
    } catch (error) {
        console.error('Error:', error);
        errorElement.innerText = error.message || "Something went wrong!";
        weatherInfo.style.display = "none";
    }
}

searchBtn.addEventListener("click", () => { 
    if (searchBox.value.trim()) {
        checkWeather(searchBox.value);
    }
});

searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && searchBox.value.trim()) {
        checkWeather(searchBox.value);
    }
});

// Optional: Load default city on startup
// window.addEventListener("DOMContentLoaded", () => {
//     checkWeather("London");
// });