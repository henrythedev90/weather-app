"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type WeatherType =
  | "clear-day"
  | "clear-night"
  | "clouds"
  | "rain"
  | "snow"
  | "thunderstorm"
  | "mist"
  | "default";

interface ThemeContextType {
  theme: WeatherType;
  setTheme: (theme: WeatherType) => void;
  getThemeColors: () => ThemeColors;
}

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  cardBackground: string;
  text: string;
  accent: string;
}

const defaultThemeColors: Record<WeatherType, ThemeColors> = {
  "clear-day": {
    primary: "#FF9900", // Sunny orange
    secondary: "#FFD700", // Gold
    background: "#87CEEB", // Sky Blue
    cardBackground: "#FFFFFF",
    text: "#333333",
    accent: "#FF6347", // Tomato red
  },
  "clear-night": {
    primary: "#2C3E50", // Dark blue
    secondary: "#8E44AD", // Purple
    background: "#1A1A2E", // Dark navy
    cardBackground: "#34495E",
    text: "#ECF0F1",
    accent: "#3498DB", // Light blue
  },
  clouds: {
    primary: "#607D8B", // Blue grey
    secondary: "#90A4AE", // Lighter blue grey
    background: "#ECEFF1", // Very light grey
    cardBackground: "#FFFFFF",
    text: "#37474F",
    accent: "#78909C", // Medium blue grey
  },
  rain: {
    primary: "#3498DB", // Blue
    secondary: "#2980B9", // Darker blue
    background: "#D6EAF8", // Light blue
    cardBackground: "#F8F9FA",
    text: "#2C3E50",
    accent: "#1ABC9C", // Turquoise
  },
  snow: {
    primary: "#BFBFBF", // Silver
    secondary: "#E0E0E0", // Light silver
    background: "#F5F5F5", // Almost white
    cardBackground: "#FFFFFF",
    text: "#555555",
    accent: "#90CAF9", // Light blue
  },
  thunderstorm: {
    primary: "#5D4037", // Brown
    secondary: "#795548", // Lighter brown
    background: "#37474F", // Dark blue-grey
    cardBackground: "#455A64",
    text: "#FFFFFF",
    accent: "#FFC107", // Amber
  },
  mist: {
    primary: "#9E9E9E", // Grey
    secondary: "#BDBDBD", // Light grey
    background: "#EEEEEE", // Very light grey
    cardBackground: "#FFFFFF",
    text: "#424242",
    accent: "#7986CB", // Indigo
  },
  default: {
    primary: "#3F51B5", // Indigo
    secondary: "#7986CB", // Lighter indigo
    background: "#E8EAF6", // Very light indigo
    cardBackground: "#FFFFFF",
    text: "#212121",
    accent: "#FF4081", // Pink
  },
};

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: "default",
  setTheme: () => {},
  getThemeColors: () => defaultThemeColors.default,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<WeatherType>("default");

  const getThemeColors = (): ThemeColors => {
    return defaultThemeColors[theme];
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, getThemeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Helper function to determine theme based on weather condition and time
export const getWeatherTheme = (
  weatherMain: string,
  weatherIcon: string
): WeatherType => {
  // OpenWeatherMap uses 'd' or 'n' suffix to indicate day or night
  const isNight = weatherIcon.endsWith("n");

  switch (weatherMain.toLowerCase()) {
    case "clear":
      return isNight ? "clear-night" : "clear-day";
    case "clouds":
      return "clouds";
    case "rain":
    case "drizzle":
      return "rain";
    case "snow":
      return "snow";
    case "thunderstorm":
      return "thunderstorm";
    case "mist":
    case "smoke":
    case "haze":
    case "dust":
    case "fog":
      return "mist";
    default:
      return "default";
  }
};
