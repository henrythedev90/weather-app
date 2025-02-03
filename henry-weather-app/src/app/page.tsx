import Weather from "./components/Weather";

export default function Home() {
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
