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
    <button
      onClick={toggleTheme}
      className={classes.light_mode_button}
      style={{
        backgroundColor: theme === "light" ? "#333" : "white",
        color: theme === "light" ? "white" : "#333",
        border: theme === "light" ? "4px solid green" : "4px solid pink",
      }}
    >
      <span>{theme === "light" ? "Light" : "Dark"}</span>
    </button>
  );
}
