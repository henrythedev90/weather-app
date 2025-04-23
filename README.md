# Henry's Weather App

A modern, responsive weather application that displays real-time weather information and forecasts with dynamic themes that change based on current weather conditions.

_Last updated: April 2025_

## Screenshot

![Henry's Weather App Screenshot](/henry-weather-app/public/images/screenshot.png)

_The app showing weather and location map for Baja Mar with 5-day forecast_

## Features

- **Dynamic Weather-Based Themes**: The app's color scheme adapts to the current weather conditions (sunny, cloudy, rainy, etc.)
- **Location-Based Weather**: Get weather for your current location with geolocation
- **Interactive Map View**: Visualize your location on an embedded map
- **Search by City**: Look up weather information for any city around the world
- **5-Day Forecast**: View a 5-day weather forecast with daily summaries
- **Temperature Unit Toggle**: Switch between Celsius and Fahrenheit
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Weather Animations**: Subtle background animations that reflect current weather

## Recent Updates

- **NEW! Added interactive map feature**: View your selected location on an embedded Mapbox map
- **Improved responsive layout**: Better display on both desktop and mobile devices
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
- **Mapbox GL JS**: For interactive location maps
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

4. Create a `.env.local` file in the root directory and add your API keys:

   ```
   OPENWEATHER_API_KEY=your_api_key_here
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## API Integration

This app uses the following APIs:

- **OpenWeatherMap API** for fetching weather data

  1. Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
  2. Add the key to your `.env.local` file as shown in the setup instructions

- **Mapbox GL JS** for displaying interactive maps
  1. Sign up for a free API key at [Mapbox](https://www.mapbox.com/)
  2. Add the key to your `.env.local` file with the prefix `NEXT_PUBLIC_` as shown in the setup instructions

## How to Use

1. When you first open the app, it will attempt to use your current location
2. If you prefer to check weather for a different location, use the search box at the top
3. Enter a city name and press Enter or click the Search button
4. View the current weather and 5-day forecast
5. Click "Show Location Map" to view your selected location on the map
6. Use the temperature toggle button to switch between Celsius and Fahrenheit

## Contribution

Feel free to fork the repository and submit pull requests. Contributions to improve functionality, design, and user experience are always welcome!

## Author

Created by Henry Nunez - [www.henry-nunez.com](https://www.henry-nunez.com)
