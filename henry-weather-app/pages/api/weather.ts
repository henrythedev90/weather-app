import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lat, lon } = req.query;
  const API_KEY = process.env.OPENWEATHER_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API key is missing" });
  }

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and longitude required" });
  }

  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!weatherRes.ok) {
      throw new Error(`Weather API Error: ${weatherRes.statusText}`);
    }

    const data = await weatherRes.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Weather API Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
}
