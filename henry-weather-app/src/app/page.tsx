"use client";
import Weather from "./components/Weather";
import { useEffect, useState } from "react";

export default function Home() {
  // const [theme, setTheme] = useState(() => {
  //   if (typeof window !== "undefined") {
  //     return localStorage.getItem("theme") || "light";
  //   }
  //   return "light";
  // });

  // useEffect(() => {
  //   document.documentElement.setAttribute("data-theme", theme);
  //   localStorage.setItem("theme", theme);
  // }, [theme]);

  // const toggleTheme = () => {
  //   setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  // };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "5vh" /* Changed to responsive height */,
      }}
    >
      <Weather />
    </div>
  );
}
