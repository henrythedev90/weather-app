"use client";
import { useState, useEffect } from "react";
import {
  Location,
  WeatherData,
  ForecastData,
  Forecast,
} from "../types/weather-types";
import Image from "next/image";
import Loading from "./Loading/Loading";
export default function Weather() {
  const [location, setLocation] = useState<Location>({ lat: 0, lon: 0 });
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string>("");
  const [isCelsius, setIsCelsius] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setIsLoading(false);
        },
        () => {
          setError("Unable to retrieve location. Please enter a city.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location.lat !== 0 && location.lon !== 0) {
      getWeatherByLocation(location.lat, location.lon);
    }
  }, [location]);

  const getWeatherByLocation = async (lat: number, lon: number) => {
    try {
      setIsLoading(true);
      setError("");
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`/api/weather?lat=${lat}&lon=${lon}`),
        fetch(`/api/forecast?lat=${lat}&lon=${lon}`),
      ]);

      if (!weatherRes.ok || !forecastRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const weatherData: WeatherData = await weatherRes.json();
      const forecastData: ForecastData = await forecastRes.json();

      setWeather(weatherData);
      setForecast(forecastData);
      setIsLoading(false);
    } catch {
      setError("Failed to fetch weather data.");
      setIsLoading(false);
    }
  };

  const convertCelsiusToFahrenheit = (celsius: number) => {
    return Math.round((celsius * 9) / 5 + 32);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center w-full pb-4 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          Henrys Weather App
        </h1>
        <a href="https://www.henry-nunez.com" target="_blank">
          <button className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 transition">
            Visit Me!
          </button>
        </a>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {/* Weather Info */}
      {weather && (
        <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {weather.name}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {weather.weather[0].description}
          </p>
          <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Feels like:{" "}
            {isCelsius
              ? weather.main.temp
              : convertCelsiusToFahrenheit(weather.main.feels_like)}
            °{isCelsius ? "C" : "F"}
          </p>
          <Image
            src={`http://openweathermap.org/img/wn/${weather.weather[0]?.icon}.png`}
            alt="Weather Icon"
            width={50}
            height={50}
            className="mx-auto"
          />
        </div>
      )}

      {/* Forecast */}
      {forecast && (
        <div className="mt-6 w-full">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center">
            5-Day Forecast
          </h2>
          <p className="text-center text-gray-700 dark:text-gray-300">
            {forecast.city.name}, {forecast.city.country}
          </p>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Sunrise:{" "}
            {new Date(forecast.city.sunrise * 1000).toLocaleTimeString(
              "en-US",
              { hour: "2-digit", minute: "2-digit" }
            )}
            &nbsp;|&nbsp; Sunset:{" "}
            {new Date(forecast.city.sunset * 1000).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          {/* Toggle Button */}
          <div className="flex justify-center mt-4">
            <button
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 transition"
              onClick={() => setIsCelsius(!isCelsius)}
            >
              Switch to {isCelsius ? "Fahrenheit" : "Celsius"}
            </button>
          </div>

          {/* Forecast List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
            {forecast.list
              .filter((_, index) => index % 8 === 0) // Show once per day
              .map((day: Forecast, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col items-center"
                >
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {new Date(day.dt_txt).toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Temp:{" "}
                    {isCelsius
                      ? day.main.temp
                      : convertCelsiusToFahrenheit(day.main.temp)}
                    °{isCelsius ? "C" : "F"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {day.weather[0]?.description}
                  </p>
                  <Image
                    src={`http://openweathermap.org/img/wn/${day.weather[0]?.icon}.png`}
                    alt="Weather Icon"
                    width={50}
                    height={50}
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
