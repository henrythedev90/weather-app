import React from "react";
import classes from "./Loading.module.css";

const Loading = () => {
  return (
    <div
      className="flex flex-col justify-center items-center h-screen w-full"
      style={{ backgroundColor: "white" }}
    >
      <h1 className="text-4xl font-bold mb-4" style={{ color: "black" }}>
        Welcome to Henrys Weather App
      </h1>
      <p className="text-2xl mb-4" style={{ color: "black" }}>
        Loading...
      </p>
      <div className={classes.loader}></div>
    </div>
  );
};

export default Loading;
