# Henry's Weather App

A modern, responsive weather application that displays real-time weather information and forecasts with dynamic themes that change based on current weather conditions.

_Last updated: July 2023_

## Features

- **Dynamic Weather-Based Themes**: The app's color scheme adapts to the current weather conditions (sunny, cloudy, rainy, etc.)
- **Location-Based Weather**: Get weather for your current location with geolocation
- **Search by City**: Look up weather information for any city around the world
- **5-Day Forecast**: View a 5-day weather forecast with daily summaries
- **Temperature Unit Toggle**: Switch between Celsius and Fahrenheit
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Weather Animations**: Subtle background animations that reflect current weather

## Recent Updates

- Added dynamic themes that change based on weather conditions
- Implemented city search functionality
- Added loading states with better error handling
- Improved UI with accessible color contrasts
- Added location services guide with clear instructions
- Added weather animations for different weather conditions
- Added temperature unit toggle for Celsius/Fahrenheit

## Technologies Used

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For responsive and customizable UI components
- **OpenWeatherMap API**: For retrieving weather data
- **Geolocation API**: For getting user's current location

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/henrythedev90/henrys-weather-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd henrys-weather-app
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file in the root directory and add your OpenWeatherMap API key:

   ```
   OPENWEATHER_API_KEY=your_api_key_here
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## API Integration

This app uses the OpenWeatherMap API for fetching weather data. To make it work, you will need an API key:

1. Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
2. Add the key to your `.env.local` file as shown in the setup instructions

## How to Use

1. When you first open the app, it will attempt to use your current location
2. If you prefer to check weather for a different location, use the search box at the top
3. Enter a city name and press Enter or click the Search button
4. View the current weather and 5-day forecast
5. Use the temperature toggle button to switch between Celsius and Fahrenheit

## Contribution

Feel free to fork the repository and submit pull requests. Contributions to improve functionality, design, and user experience are always welcome!

## Author

Created by Henry Nunez - [www.henry-nunez.com](https://www.henry-nunez.com)
