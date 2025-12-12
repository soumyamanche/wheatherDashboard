// ========== CONFIG ==========
const OPENWEATHER_API_KEY = "55aab23c7073affa784b966ab496fb5f"; // ✅ your key
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const AIR_URL = "https://api.openweathermap.org/data/2.5/air_pollution";

// ========== DOM ELEMENTS ==========
const form = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const statusEl = document.getElementById("status");
const suggestionBox = document.getElementById("suggestions");

// Weather
const tempEl = document.getElementById("temp");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const descEl = document.getElementById("desc");
const iconEl = document.getElementById("icon");
const locationMetaEl = document.getElementById("locationMeta");

// AQI
const aqiBadge = document.getElementById("aqiBadge");
const pm25El = document.getElementById("pm25");
const pm10El = document.getElementById("pm10");
const no2El = document.getElementById("no2");
const o3El = document.getElementById("o3");
const coEl = document.getElementById("co");
const adviceEl = document.getElementById("advice");

// Share
const waShare = document.getElementById("waShare");

// ========== HELPERS ==========
const kelvinToC = (k) => Math.round(k - 273.15);
const fmt = (n, unit = "") =>
  n === null || n === undefined ? "—" : `${n}${unit}`;

const aqiInfo = (aqi) => {
  switch (aqi) {
    case 1:
      return {
        label: "Good",
        class: "aqi--1",
        tip: "Air quality is good — perfect for outdoor activities.",
      };
    case 2:
      return {
        label: "Fair",
        class: "aqi--2",
        tip: "Air quality is acceptable. Sensitive individuals may consider shorter outdoor exposure.",
      };
    case 3:
      return {
        label: "Moderate",
        class: "aqi--3",
        tip: "Limit prolonged outdoor exertion if you are sensitive (asthma, elderly, kids).",
      };
    case 4:
      return {
        label: "Poor",
        class: "aqi--4",
        tip: "Consider a mask and reduce outdoor exercise. Keep windows closed.",
      };
    case 5:
      return {
        label: "Very Poor",
        class: "aqi--5",
        tip: "Avoid outdoor activity; use a respirator mask if you must go out.",
      };
    default:
      return { label: "—", class: "", tip: "—" };
  }
};

function setStatus(msg) {
  statusEl.textContent = msg;
}
function setShare(city, text) {
  const url = `https://wa.me/?text=${encodeURIComponent(`${city} • ${text}`)}`;
  waShare.href = url;
  waShare.textContent = "Share on WhatsApp";
}

// ========== RENDER ==========
function renderWeather(data) {
  const { name, sys, weather, main, wind } = data;
  const icon = weather?.[0]?.icon;
  const desc = weather?.[0]?.description ?? "—";

  tempEl.textContent = fmt(main.temp, "°C");
  humidityEl.textContent = fmt(main.humidity, "%");
  windEl.textContent = fmt(wind.speed, " m/s");
  descEl.textContent = desc.charAt(0).toUpperCase() + desc.slice(1);

  if (icon) {
    iconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    iconEl.alt = desc;
  } else {
    iconEl.removeAttribute("src");
    iconEl.alt = "";
  }
  locationMetaEl.textContent = `${name}, ${sys?.country ?? ""}`;
}

function renderAQI(data) {
  const aqi = data.list?.[0]?.main?.aqi ?? 0;
  const comp = data.list?.[0]?.components ?? {};
  const info = aqiInfo(aqi);

  aqiBadge.className = "aqi-badge";
  if (info.class) aqiBadge.classList.add(info.class);
  aqiBadge.textContent = `AQI ${aqi} • ${info.label}`;

  pm25El.textContent = fmt(Math.round(comp.pm2_5), " µg/m³");
  pm10El.textContent = fmt(Math.round(comp.pm10), " µg/m³");
  no2El.textContent = fmt(Math.round(comp.no2), " µg/m³");
  o3El.textContent = fmt(Math.round(comp.o3), " µg/m³");
  coEl.textContent = fmt(Math.round(comp.co), " µg/m³");

  adviceEl.textContent = info.tip;
}

// ========== FETCH ==========
async function fetchWeatherByCity(city) {
  // Add &units=metric for Celsius
  const url = `${WEATHER_URL}?q=${encodeURIComponent(
    city
  )}&units=metric&appid=${OPENWEATHER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`Weather error: ${res.status} ${res.statusText}`);
  return res.json();
}

async function fetchAirByCoords(lat, lon) {
  const url = `${AIR_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Air error: ${res.status} ${res.statusText}`);
  return res.json();
}

// ========== APP ==========
async function loadCity(city) {
  try {
    setStatus("Loading…");
    const weather = await fetchWeatherByCity(city);
    renderWeather(weather);

    const { lat, lon } = weather.coord;
    const air = await fetchAirByCoords(lat, lon);
    renderAQI(air);

    setShare(
      `${weather.name}, ${weather.sys?.country ?? ""}`,
      `Temp ${weather.main.temp}°C • AQI ${air.list?.[0]?.main?.aqi}`
    );
    setStatus("Done.");
  } catch (err) {
    console.error(err);
    setStatus("Could not fetch data. Check the city name or your API key.");
    // Clear fields
    iconEl.removeAttribute("src");
    descEl.textContent = "—";
    tempEl.textContent = humidityEl.textContent = windEl.textContent = "—";
    aqiBadge.textContent = "AQI —";
    aqiBadge.className = "aqi-badge";
    pm25El.textContent =
      pm10El.textContent =
      no2El.textContent =
      o3El.textContent =
      coEl.textContent =
        "—";
    adviceEl.textContent = "—";
  }
}

// ========== EVENTS ==========
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim() || "Hyderabad";
  loadCity(city);
});

document.addEventListener("DOMContentLoaded", () => {
  cityInput.placeholder = "Enter city (e.g., Hyderabad)";
  loadCity("Hyderabad");
});

// ========== CITY SUGGESTIONS ==========
// const cities = [
//   "Hyderabad",
//   "Mumbai",
//   "Delhi",
//   "Bangalore",
//   "Chennai",
//   "Kolkata",
//   "Pune",
//   "Ahmedabad",
//   "Jaipur",
//   "Lucknow",
//   "Kanpur",
//   "Nagpur",
//   "Indore",
//   "Thane",
//   "Bhopal",
//   "Visakhapatnam",
//   "Patna",
//   "Vadodara",
//   "Ghaziabad",
//   "Ludhiana",
// ];
// cityInput.addEventListener("input", () => {
//   const query = cityInput.value.toLowerCase();
//   suggestionBox.innerHTML = "";
//   if (query.length === 0) return;
//   const matchedCities = cities.filter((city) =>
//     city.toLowerCase().startsWith(query)
//   );
//   matchedCities.forEach((city) => {
//     const div = document.createElement("div");
//     div.textContent = city;
//     div.className = "suggestion-item";
//     div.addEventListener("click", () => {
//       cityInput.value = city;
//       suggestionBox.innerHTML = "";
//       loadCity(city);
//     });
//     suggestionBox.appendChild(div);
//   });
// });
// document.addEventListener("click", (e) => {
//   if (e.target !== cityInput) {
//     suggestionBox.innerHTML = "";
//   }
// });
// // End of app.js
// ========== CITY SUGGESTIONS ==========

const suggestion = document.getElementById("suggestions");

cityInput.addEventListener("input", async function () {
  const query = this.value.trim();

  if (query.length < 2) {
    suggestionBox.innerHTML = "";
    return;
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        query
      )}&limit=5&appid=${OPENWEATHER_API_KEY}`
    );
    const data = await res.json();

    // Create dropdown items with City + Country
    suggestionBox.innerHTML = data
      .map(
        (c) => `<div class="suggestion-item" data-city="${c.name},${c.country}">
                            ${c.name}, ${c.country}
                        </div>`
      )
      .join("");
  } catch (err) {
    console.error("Error fetching city suggestions:", err);
    suggestionBox.innerHTML = "";
  }
});

// On clicking a suggestion
suggestionBox.addEventListener("click", (e) => {
  if (!e.target.dataset.city) return;

  cityInput.value = e.target.dataset.city;
  suggestionBox.innerHTML = "";
});
