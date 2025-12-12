# Weather & Air Quality Dashboard

This is a single-page web app that shows current weather conditions and air-quality metrics for any city using the OpenWeather APIs. Enter a location and the dashboard displays temperature, humidity, wind speed, a descriptive icon, AQI classification, pollutant concentrations, and a short health advisory. A WhatsApp share shortcut makes it easy to send the latest snapshot to friends or family.

## Features
- Current weather data (temperature, humidity, wind, description, icon).
- Air quality index with severity badge and tailored health advice.
- Pollutant breakdown for PM2.5, PM10, NO₂, O₃, and CO.
- WhatsApp share link pre-filled with the city, temperature, and AQI.
- Graceful error handling and default city fallback (`Hyderabad`).

## Getting Started

1. **Clone or download** this project and open the folder in your editor.
2. **Install dependencies:** none required—everything runs in the browser.
3. **Configure your OpenWeather API key:**
   - Sign up at [https://openweathermap.org/api](https://openweathermap.org/api) to create a free API key.
   - Open `app.js` and replace the placeholder value of `OPENWEATHER_API_KEY` with your key.
4. **Open `index.html`** in your browser (double-click or use a live-server extension) and search for any city.

## Project Structure
- `index.html` — markup for the dashboard layout.
- `style.css` — styling for cards, typography, and responsive layout.
- `app.js` — API integration, rendering logic, and event handlers.

## Notes & Next Steps
- Respect OpenWeather rate limits; cache results when deploying publicly.
- Consider moving the API key to a server-side proxy before going live.
- Enhancements to try: unit toggles (°C/°F), geolocation lookup, 5-day forecast, or bookmarking favorite cities.

Happy forecasting!

