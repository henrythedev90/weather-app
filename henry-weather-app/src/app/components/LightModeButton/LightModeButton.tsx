import React from "react";
import classes from "./LightModeButton.module.css";

export default function LightModeButton({
  toggleTheme,
  theme,
}: {
  toggleTheme: () => void;
  theme: string;
}) {
  return (
    <div>
      <button
        onClick={toggleTheme}
        className={`px-4 py-2 font-semibold rounded-lg transition 
        ${
          theme === "light"
            ? "bg-gray-900 text-white border-4 border-green-500"
            : "bg-white text-gray-900 border-4 border-pink-500"
        }
        hover:scale-105 shadow-md`}
      >
        <span>{theme === "light" ? "Light" : "Dark"}</span>
      </button>
    </div>
  );
}
