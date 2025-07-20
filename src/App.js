// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from 'react';
const App = () => {
const [searchQuery, setSearchQuery] = useState('');
const [weatherData, setWeatherData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [location, setLocation] = useState(null);
const [currentTheme, setCurrentTheme] = useState({
primary: '#4F46E5',
secondary: '#818CF8',
gradient: 'from-indigo-500 to-purple-600',
cardBg: 'bg-white',
textColor: 'text-gray-900'
});
useEffect(() => {
const getCurrentLocation = () => {
if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(
(position) => {
setLocation({
lat: position.coords.latitude,
lon: position.coords.longitude
});
},
(error) => {
console.error("Error getting location:", error);
fetchWeatherData("New York");
}
);
} else {
fetchWeatherData("New York");
}
};
getCurrentLocation();
}, []);
useEffect(() => {
if (location) {
fetchWeatherByCoords(location.lat, location.lon);
}
}, [location]);
const getWeatherTheme = (weatherCondition: string): ThemeConfig => {
const condition = weatherCondition.toLowerCase();
if (condition.includes('clear') || condition.includes('sun')) {
return {
primary: '#FF8C00',
secondary: '#FFD700',
gradient: 'from-orange-500 to-yellow-400',
cardBg: 'bg-orange-50',
textColor: 'text-orange-900'
};
} else if (condition.includes('rain') || condition.includes('drizzle')) {
return {
primary: '#4682B4',
secondary: '#87CEEB',
gradient: 'from-blue-600 to-blue-400',
cardBg: 'bg-blue-50',
textColor: 'text-blue-900'
};
} else if (condition.includes('cloud')) {
return {
primary: '#708090',
secondary: '#B0C4DE',
gradient: 'from-gray-500 to-gray-300',
cardBg: 'bg-gray-50',
textColor: 'text-gray-900'
};
} else if (condition.includes('snow')) {
return {
primary: '#B0E0E6',
secondary: '#FFFFFF',
gradient: 'from-cyan-200 to-white',
cardBg: 'bg-white',
textColor: 'text-cyan-900'
};
} else if (condition.includes('thunder') || condition.includes('storm')) {
return {
primary: '#483D8B',
secondary: '#00FFFF',
gradient: 'from-purple-700 to-cyan-400',
cardBg: 'bg-purple-50',
textColor: 'text-purple-900'
};
}
return {
primary: '#4F46E5',
secondary: '#818CF8',
gradient: 'from-indigo-500 to-purple-600',
cardBg: 'bg-white',
textColor: 'text-gray-900'
};
};
const fetchWeatherByCoords = async (lat, lon) => {
setLoading(true);
setError('');
try {
const API_KEY = '0dcc2b467c15b75988d9aba0cd19c63d';
const response = await fetch(
`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
);
if (!response.ok) {
throw new Error('Unable to fetch weather data');
}
const data: WeatherData = await response.json();
setWeatherData(data);
const newTheme = getWeatherTheme(data.weather[0].main);
setCurrentTheme(newTheme);
} catch (err) {
setError('Unable to fetch weather data. Please try again later.');
setWeatherData(null);
} finally {
setLoading(false);
}
};
const fetchWeatherData = async (city) => {
if (!city.trim()) return;
setLoading(true);
setError('');
try {
const API_KEY = '0dcc2b467c15b75988d9aba0cd19c63d';
const response = await fetch(
`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
);
if (!response.ok) {
throw new Error('City not found');
}
const data: WeatherData = await response.json();
setWeatherData(data);
const newTheme = getWeatherTheme(data.weather[0].main);
setCurrentTheme(newTheme);
} catch (err) {
setError('Unable to fetch weather data. Please check the city name and try again.');
setWeatherData(null);
} finally {
setLoading(false);
}
};
const handleSearch = (e) => {
e.preventDefault();
if (searchQuery.trim()) {
  fetchWeatherData(searchQuery.trim());
}
};
const clearSearch = () => {
setSearchQuery('');
setError('');
};
const getWeatherIcon = (condition) => {
const conditionLower = condition.toLowerCase();
if (conditionLower.includes('clear') || conditionLower.includes('sun')) return 'fas fa-sun';
if (conditionLower.includes('rain')) return 'fas fa-cloud-rain';
if (conditionLower.includes('cloud')) return 'fas fa-cloud';
if (conditionLower.includes('snow')) return 'fas fa-snowflake';
if (conditionLower.includes('thunder')) return 'fas fa-bolt';
return 'fas fa-cloud-sun';
};
useEffect(() => {
fetchWeatherData('New York');
}, []);
return (
<div className="min-h-screen transition-all duration-500 relative overflow-hidden" style={{
background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
}}>
<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
<div className="container mx-auto px-4 py-4 max-w-md">
<div className="flex items-center justify-between mb-6">
<button
onClick={() => location && fetchWeatherByCoords(location.lat, location.lon)}
className="p-2 rounded-full backdrop-blur-md bg-white/20 border border-white/20 text-white"
>
<i className="fas fa-location-arrow"></i>
</button>
<div className="text-white text-sm">
{new Date().toLocaleDateString('en-US', {
weekday: 'long',
year: 'numeric',
month: 'long',
day: 'numeric'
})}
</div>
</div>
{/* Header */}
<div className="text-center mb-8">
<h1 className={`text-3xl font-bold ${currentTheme.textColor} mb-2`}>
Weather App
</h1>
<p className="text-gray-600">Get current weather conditions</p>
</div>
{/* Search Section */}
<form onSubmit={handleSearch} className="mb-8">
<div className="relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<i className="fas fa-search text-gray-400 text-sm"></i>
</div>
<input
type="text"
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
placeholder="Search for a city..."
className="w-full pl-10 pr-12 py-3 backdrop-blur-md bg-white/30 border border-white/20 rounded-xl focus:ring-2 focus:ring-opacity-50 focus:border-transparent outline-none transition-all text-sm text-gray-800 placeholder-gray-500"
style={{
focusRingColor: currentTheme.primary + '50',
borderColor: searchQuery ? currentTheme.primary : undefined
}}
/>
{searchQuery && (
<button
type="button"
onClick={clearSearch}
className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
>
<i className="fas fa-times text-gray-400 hover:text-gray-600 text-sm"></i>
</button>
)}
</div>
<button
type="submit"
disabled={loading || !searchQuery.trim()}
className="w-full mt-4 py-3 rounded-xl font-medium text-white transition-all duration-300 !rounded-button whitespace-nowrap cursor-pointer"
style={{
background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
opacity: (!searchQuery.trim() || loading) ? 0.7 : 1
}}
>
{loading ? 'Searching...' : 'Search Weather'}
</button>
</form>
{/* Loading Indicator */}
{loading && (
<div className="text-center mb-6">
<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2"
style={{ borderColor: currentTheme.primary }}></div>
</div>
)}
{/* Error Message */}
{error && (
<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
<p className="text-red-600 text-sm text-center">{error}</p>
</div>
)}
{/* Weather Card */}
{weatherData && !loading && (
<div className={`backdrop-blur-lg bg-white/30 rounded-3xl shadow-lg p-6 mb-4 transition-all duration-500 border border-white/20`}>
<div className="absolute top-2 right-2">
<div className="text-xs text-gray-400">
Last updated: {new Date().toLocaleTimeString()}
</div>
</div>
{/* Location */}
<div className="text-center mb-6">
<h2 className={`text-2xl font-bold ${currentTheme.textColor}`}>
{weatherData.name}, {weatherData.sys.country}
</h2>
</div>
{/* Main Weather Info */}
<div className="text-center mb-8">
<div className="mb-4">
<i className={`${getWeatherIcon(weatherData.weather[0].main)} text-6xl`}
style={{ color: currentTheme.primary }}></i>
</div>
<div className={`text-5xl font-bold ${currentTheme.textColor} mb-2`}>
{Math.round(weatherData.main.temp)}°C
</div>
<div className="text-gray-600 capitalize text-lg">
{weatherData.weather[0].description}
</div>
<div className="text-gray-500 text-sm mt-1">
Feels like {Math.round(weatherData.main.feels_like)}°C
</div>
</div>
{/* Weather Details Grid */}
<div className="grid grid-cols-2 gap-3">
<div className="backdrop-blur-md bg-white/20 rounded-2xl p-3 text-center border border-white/10 hover:bg-white/30 transition-all duration-300">
<i className="fas fa-tint text-2xl mb-2" style={{ color: currentTheme.primary }}></i>
<div className={`text-lg font-semibold ${currentTheme.textColor}`}>
{weatherData.main.humidity}%
</div>
<div className="text-gray-600 text-sm">Humidity</div>
</div>
<div className="backdrop-blur-md bg-white/20 rounded-xl p-4 text-center border border-white/10 hover:bg-white/30 transition-all duration-300">
<i className="fas fa-wind text-2xl mb-2" style={{ color: currentTheme.primary }}></i>
<div className={`text-lg font-semibold ${currentTheme.textColor}`}>
{Math.round(weatherData.wind.speed * 3.6)} km/h
</div>
<div className="text-gray-600 text-sm">Wind Speed</div>
</div>
<div className="backdrop-blur-md bg-white/20 rounded-xl p-4 text-center border border-white/10 hover:bg-white/30 transition-all duration-300">
<i className="fas fa-thermometer-half text-2xl mb-2" style={{ color: currentTheme.primary }}></i>
<div className={`text-lg font-semibold ${currentTheme.textColor}`}>
{Math.round(weatherData.main.temp)}°C
</div>
<div className="text-gray-600 text-sm">Temperature</div>
</div>
<div className="backdrop-blur-md bg-white/20 rounded-xl p-4 text-center border border-white/10 hover:bg-white/30 transition-all duration-300">
<i className="fas fa-eye text-2xl mb-2" style={{ color: currentTheme.primary }}></i>
<div className={`text-lg font-semibold ${currentTheme.textColor}`}>
Good
</div>
<div className="text-gray-600 text-sm">Visibility</div>
</div>
</div>
</div>
)}
{/* Footer */}
<div className="text-center text-gray-500 text-sm">
<p>Powered by OpenWeatherMap API</p>
</div>
</div>
<style>{`
.!rounded-button {
border-radius: 12px !important;
}
input:focus {
ring: 2px solid ${currentTheme.primary}50;
}
@media (max-width: 640px) {
.container {
padding-left: 1rem;
padding-right: 1rem;
}
}
::-webkit-scrollbar {
display: none;
}
.weather-card {
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
}
`}</style>
</div>
);
};
export default App