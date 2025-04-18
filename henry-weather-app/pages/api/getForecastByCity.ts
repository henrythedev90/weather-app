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
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (!forecastRes.ok) {
      throw new Error(`Forecast API Error: ${forecastRes.statusText}`);
    }

    const data = await forecastRes.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Forecast API Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch forecast data" });
  }
}
