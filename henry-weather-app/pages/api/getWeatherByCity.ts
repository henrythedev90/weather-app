import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { city } = req.query;
  const API_KEY = process.env.OPENWEATHER_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API key is missing" });
  }

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
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
