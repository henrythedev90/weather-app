"use client";
import { useState, useEffect } from "react";
import { Location, WeatherData, ForecastData } from "../types/weather-types";
import LightModeButton from "./LightModeButton/LightModeButton";
import Image from "next/image";
export default function Weather({
  theme,
  toggleTheme,
}: {
  theme: string;
  toggleTheme: () => void;
}) {
  const [location, setLocation] = useState<Location>({ lat: null, lon: null });
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string>("");
  const [isCelsius, setIsCelsius] = useState(true);
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
      debugger;
      setForecast(forecastData);
    } catch {
      setError("Failed to fetch weather data.");
    }
  };

  const convertCelsiusToFahrenheit = (celsius: number) => {
    return Math.round((celsius * 9) / 5 + 32);
  };

  return (
    <div>
      <div>
        <h1>Weather App</h1>
        <LightModeButton theme={theme} toggleTheme={toggleTheme} />
      </div>
      {error && <p>{error}</p>}

      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <div>
            <p>Condition: {weather.weather[0].description}</p>
            <p>
              Temperature:{" "}
              {isCelsius
                ? weather.main.temp
                : convertCelsiusToFahrenheit(weather.main.temp)}
              °{isCelsius ? "C" : "F"}
            </p>
            <button onClick={() => setIsCelsius(!isCelsius)}>
              Switch to {isCelsius ? "Fahrenheit" : "Celsius"}
            </button>
            <Image
              src={`http://openweathermap.org/img/wn/${weather.weather[0]?.icon}.png`}
              alt="Weather Icon"
              width={50}
              height={50}
            />
            <p>
              Feels like:{" "}
              {isCelsius
                ? weather.main.temp
                : convertCelsiusToFahrenheit(weather.main.feels_like)}
              °{isCelsius ? "C" : "F"}
            </p>
          </div>
        </div>
      )}

      {forecast && (
        <div className="mt-4 p-4 bg-gray-200 rounded">
          <h2 className="text-xl font-semibold">5-Day Forecast</h2>
          <div className="flex flex-col">
            {forecast.list
              .filter((_, index) => index % 8 === 0) // Show once per day
              .map((day, idx) => (
                <div
                  key={idx}
                  className="bg-white p-2 rounded shadow mt-2 mb-2"
                >
                  <p>
                    {new Date(day.dt_txt).toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </p>
                  <p>
                    Temp:{" "}
                    {isCelsius
                      ? day.main.temp
                      : convertCelsiusToFahrenheit(day.main.temp)}
                    °{isCelsius ? "C" : "F"}
                  </p>
                  <p>{day.weather[0]?.description}</p>
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
