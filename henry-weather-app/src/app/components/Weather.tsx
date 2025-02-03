"use client";
import { useState, useEffect } from "react";
import { Location, WeatherData, ForecastData } from "../types/weather-types";

export default function Weather() {
  const [location, setLocation] = useState<Location>({ lat: null, lon: null });
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        () => {
          debugger;
          setError("Unable to retrieve location. Please enter a city.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (location.lat !== null && location.lon !== null) {
      getWeatherByLocation(location.lat, location.lon);
    }
  }, [location]);

  const getWeatherByLocation = async (lat: number, lon: number) => {
    try {
      debugger;
      console.log("lat", lat);
      console.log("lon", lon);
      setError("");
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`/api/weather?lat=${lat}&lon=${lon}`),
        fetch(`/api/forecast?lat=${lat}&lon=${lon}`),
      ]);

      if (!weatherRes.ok || !forecastRes.ok) {
        debugger;
        throw new Error("Failed to fetch data");
      }

      const weatherData: WeatherData = await weatherRes.json();
      const forecastData: ForecastData = await forecastRes.json();

      setWeather(weatherData);
      setForecast(forecastData);
    } catch {
      setError("Failed to fetch weather data.");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Weather App</h1>

      {error && <p className="text-red-500">{error}</p>}

      {weather && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold">{weather.name}</h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Condition: {weather.weather[0].description}</p>
        </div>
      )}

      {forecast && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold">5-Day Forecast</h2>
          <div className="grid grid-cols-2 gap-2">
            {forecast.list
              .filter((_, index) => index % 8 === 0) // Show once per day
              .map((day, idx) => (
                <div key={idx} className="bg-white p-2 rounded shadow">
                  <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
                  <p>Temp: {day.main.temp}°C</p>
                  <p>{day.weather[0].description}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
