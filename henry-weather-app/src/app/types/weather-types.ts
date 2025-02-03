export interface Location {
  lat: number;
  lon: number;
}
export interface WeatherData {
  name: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
    grnd_level: number;
    humidity: number;
    pressure: number;
    sea_level: number;
  };
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  visibility: number;
  weather: { description: string; icon: string; main: string; id: number }[];
  wind: { speed: number; deg: number };
}

export interface ForecastData {
  list: {
    dt_txt: string;
    main: { temp: number };
    weather: { description: string; icon: string }[];
  }[];
}
