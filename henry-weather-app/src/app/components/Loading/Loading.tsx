import React from "react";
import classes from "./Loading.module.css";

const Loading = () => {
  return (
    <div className="theme-container flex flex-col justify-center items-center h-screen w-full">
      <h1 className="text-4xl font-bold mb-4">Welcome to Henrys Weather App</h1>
      <p className="text-2xl mb-4">Loading...</p>
      <div className={classes.loader}></div>
    </div>
  );
};

export default Loading;
