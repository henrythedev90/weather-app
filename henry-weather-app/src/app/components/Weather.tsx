"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Location,
  WeatherData,
  ForecastData,
  Forecast,
} from "../types/weather-types";
import Image from "next/image";
import Loading from "./Loading/Loading";
import { useTheme, getWeatherTheme } from "../context/ThemeContext";
import UserInput from "./UserInput";
import dynamic from "next/dynamic";

// Import MapComponent with client-side only rendering (no SSR)
const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

export default function Weather() {
  const [location, setLocation] = useState<Location>({ lat: 0, lon: 0 });
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string>("");
  const [isCelsius, setIsCelsius] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [noLocationProvided, setNoLocationProvided] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const { setTheme, getThemeColors } = useTheme();

  const NA = "🌎";
  const AF = "🌍";
  const AS = "🌏";

  const globalEmoji = useMemo(() => [NA, AF, AS], []);
  const [currentEmoji, setCurrentEmoji] = useState(globalEmoji[0]);

  let i = 0;
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmoji(globalEmoji[i++ % globalEmoji.length]);
    }, 500);
    return () => clearInterval(interval);
  }, [globalEmoji, i]);

  // Apply theme based on weather
  useEffect(() => {
    if (weather?.weather[0]) {
      const weatherTheme = getWeatherTheme(
        weather.weather[0].main,
        weather.weather[0].icon
      );
      setTheme(weatherTheme);
    }
  }, [weather, setTheme]);

  // Apply theme CSS variables
  useEffect(() => {
    if (weather) {
      const colors = getThemeColors();
      document.documentElement.style.setProperty(
        "--theme-primary",
        colors.primary
      );
      document.documentElement.style.setProperty(
        "--theme-secondary",
        colors.secondary
      );
      document.documentElement.style.setProperty(
        "--theme-background",
        colors.background
      );
      document.documentElement.style.setProperty(
        "--theme-card-background",
        colors.cardBackground
      );
      document.documentElement.style.setProperty("--theme-text", colors.text);
      document.documentElement.style.setProperty(
        "--theme-accent",
        colors.accent
      );
    }
  }, [weather, getThemeColors]);

  // Get user's location with a timeout
  useEffect(() => {
    setIsLoading(true);

    // Set a timeout to prevent waiting too long for geolocation
    const timeoutId = setTimeout(() => {
      if (isInitialLoad) {
        setNoLocationProvided(true);
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    }, 5000); // 5 seconds timeout

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setIsLoading(false);
          setIsInitialLoad(false);
          setNoLocationProvided(false);
        },
        (geoError) => {
          clearTimeout(timeoutId);
          console.log("Geolocation error:", geoError.message);
          setNoLocationProvided(true);
          setIsLoading(false);
          setIsInitialLoad(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 4000, // 4 seconds timeout
          maximumAge: 0,
        }
      );
    } else {
      clearTimeout(timeoutId);
      setNoLocationProvided(true);
      setIsLoading(false);
      setIsInitialLoad(false);
    }

    return () => clearTimeout(timeoutId);
  }, [isInitialLoad]);

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
        throw new Error("Failed to fetch weather data");
      }

      const weatherData: WeatherData = await weatherRes.json();
      const forecastData: ForecastData = await forecastRes.json();

      setWeather(weatherData);
      setForecast(forecastData);
      setIsLoading(false);
      setNoLocationProvided(false);
      // eslint-disable-next-line
    } catch (err: unknown) {
      setError("Failed to fetch weather data.");
      setIsLoading(false);
    }
  };

  const getWeatherByCity = async (city: string) => {
    try {
      setIsLoading(true);
      setError("");
      setNoLocationProvided(false);

      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`/api/getWeatherByCity?city=${encodeURIComponent(city)}`),
        fetch(`/api/getForecastByCity?city=${encodeURIComponent(city)}`),
      ]);

      if (!weatherRes.ok) {
        const errorData = await weatherRes.json();
        throw new Error(errorData.error || "Failed to find city");
      }

      if (!forecastRes.ok) {
        const errorData = await forecastRes.json();
        throw new Error(errorData.error || "Failed to fetch forecast");
      }

      const weatherData: WeatherData = await weatherRes.json();
      const forecastData: ForecastData = await forecastRes.json();

      // Update coordinates in case user wants to get local weather later
      if (weatherData.coord) {
        setLocation({
          lat: weatherData.coord.lat,
          lon: weatherData.coord.lon,
        });
      }

      setWeather(weatherData);
      setForecast(forecastData);
      setIsLoading(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch weather data."
      );
      setIsLoading(false);
    }
  };

  const handleCitySearch = (city: string) => {
    getWeatherByCity(city);
  };

  const convertCelsiusToFahrenheit = (celsius: number) => {
    return Math.round((celsius * 9) / 5 + 32);
  };

  // Get animation class name based on current weather
  const animationClass = useMemo(() => {
    if (!weather?.weather[0]) return "";

    const weatherMain = weather.weather[0].main.toLowerCase();
    const isNight = weather.weather[0].icon.endsWith("n");

    if (weatherMain === "clear") {
      return isNight ? "clear-night-animation" : "clear-day-animation";
    } else if (weatherMain === "rain" || weatherMain === "drizzle") {
      return "rain-animation";
    } else if (weatherMain === "snow") {
      return "snow-animation";
    }

    return "";
  }, [weather]);

  // Add this function just before the return statement
  const handleLocationRequest = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setIsLoading(false);
        setNoLocationProvided(false);
      },
      (error) => {
        // Provide user-friendly messages based on error code
        let userMsg = "Failed to get your location";
        if (error.code === 1) {
          userMsg =
            "Location access was denied. Please enable location in your browser and try again.";
        } else if (error.code === 2) {
          userMsg =
            "Your location is currently unavailable. Please try again later.";
        } else if (error.code === 3) {
          userMsg = "Location request timed out. Please try again.";
        }

        setError(userMsg);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // If it's the initial load and we're still loading, show the full loading screen
  if (isInitialLoad && isLoading) {
    return <Loading />;
  }

  return (
    <div className="theme-container min-h-screen flex flex-col items-center w-full p-6 relative">
      {/* Animation layer */}
      {animationClass && <div className={animationClass}></div>}

      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="theme-header flex justify-between items-center w-full p-4 rounded-lg mb-6">
          <h1 className="text-2xl font-bold text-center">Henrys Weather App</h1>
          <div className="flex gap-4">
            <a href="https://www.henry-nunez.com" target="_blank">
              <button className="theme-button px-4 py-2 rounded-lg">
                Visit Me!
                <span className="ml-2">{currentEmoji}</span>
              </button>
            </a>
          </div>
        </div>

        {/* Search by city */}
        <UserInput onSearch={handleCitySearch} />

        {/* Welcome message */}
        {noLocationProvided && !weather && !error && (
          <div className="theme-card p-6 my-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to Henry&apos;s Weather App!
            </h2>
            <p className="mb-4 text-lg">
              Please enter a city name in the search box above to check the
              weather forecast.
            </p>
            <p className="mb-4 text-lg">Or</p>
            <p className="mb-4 text-lg">
              You can click on the button below to check out the weather in your
              current location.
            </p>
            <div className="my-5">
              <button
                onClick={handleLocationRequest}
                className="theme-button px-5 py-3 rounded-lg text-white font-medium text-lg"
              >
                Use My Location
              </button>
            </div>
            <div className="mt-5 p-5 bg-gray-200 rounded-lg border border-gray-300">
              <p className="font-bold mb-3 text-base">
                How to enable location services:
              </p>
              <ul className="text-left list-disc list-inside space-y-2">
                <li className="font-medium">
                  <strong className="text-black">Chrome/Edge:</strong> Click the
                  lock/info icon in the address bar → Site settings → Allow
                  location
                </li>
                <li className="font-medium">
                  <strong className="text-black">Firefox:</strong> Click the
                  shield icon in the address bar → Site permissions → Allow
                  location
                </li>
                <li className="font-medium">
                  <strong className="text-black">Safari:</strong> Go to Safari
                  preferences → Websites → Location → Allow for this website
                </li>
                <li className="font-medium">
                  <strong className="text-black">Mobile:</strong> Check your
                  device settings for browser location permissions
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-4 my-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading indicator for data fetch */}
        {!isInitialLoad && isLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-32 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-16 bg-gray-300 rounded"></div>
            </div>
          </div>
        )}

        {/* Weather Info and Map Container - Wrap both sections for responsive layout */}
        {weather && (
          <div className="flex flex-col lg:flex-row gap-4 mt-6">
            {/* Weather Info Card */}
            <div className="theme-card p-6 rounded-lg shadow-md w-full lg:w-1/2 text-center">
              <h2 className="text-xl font-semibold">{weather.name}</h2>
              <p className="theme-accent-text">
                {weather.weather[0].description}
              </p>
              <p className="text-lg font-medium">
                Temp:{" "}
                {isCelsius
                  ? Math.round(weather.main.temp)
                  : convertCelsiusToFahrenheit(weather.main.temp)}
                °{isCelsius ? "C" : "F"}
              </p>
              <p className="text-lg font-medium">
                Feels like:{" "}
                {isCelsius
                  ? Math.round(weather.main.feels_like)
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

              {/* Map toggle button */}
              <div className="mt-3">
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="theme-button px-4 py-2 rounded-lg"
                >
                  {showMap ? "Hide Map" : "Show Location Map"}
                </button>
              </div>
            </div>

            {/* Map Container - Always present for consistent layout */}
            <div className="w-full lg:w-1/2">
              {showMap && location.lat !== 0 && location.lon !== 0 ? (
                <div className="theme-card p-4 rounded-lg shadow-md h-full">
                  <h2 className="text-xl font-semibold mb-2 text-center">
                    Your Location
                  </h2>
                  <p className="text-center mb-3">
                    <span className="font-medium">Coordinates:</span>{" "}
                    {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                  </p>
                  <div className="h-[300px] lg:h-[calc(100%-80px)] w-full rounded-lg overflow-hidden">
                    <MapComponent
                      latitude={location.lat}
                      longitude={location.lon}
                    />
                  </div>
                </div>
              ) : (
                <div className="theme-card p-4 rounded-lg shadow-md h-full flex items-center justify-center">
                  <h2 className="text-xl font-semibold text-center">
                    Click "Show Location Map" to view your location
                  </h2>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Forecast */}
        {forecast && (
          <div className="mt-6 w-full">
            <h2 className="text-xl font-semibold text-center">
              5-Day Forecast
            </h2>
            <p className="text-center">
              {forecast.city.name}, {forecast.city.country}
            </p>
            <p className="text-center opacity-75">
              Sunrise:{" "}
              {new Date(forecast.city.sunrise * 1000).toLocaleTimeString(
                "en-US",
                { hour: "2-digit", minute: "2-digit" }
              )}
              &nbsp;|&nbsp; Sunset:{" "}
              {new Date(forecast.city.sunset * 1000).toLocaleTimeString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </p>

            {/* Toggle Button */}
            <div className="flex justify-center mt-4">
              <button
                className="theme-button px-4 py-2 rounded-lg"
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
                    className="theme-card p-4 rounded-lg shadow-md flex flex-col items-center"
                  >
                    <p className="text-lg font-semibold">
                      {new Date(day.dt_txt).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </p>
                    <p>
                      Temp:{" "}
                      {isCelsius
                        ? Math.round(day.main.temp)
                        : convertCelsiusToFahrenheit(day.main.temp)}
                      °{isCelsius ? "C" : "F"}
                    </p>
                    <p className="theme-accent-text">
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
    </div>
  );
}
