import { useState, KeyboardEvent } from "react";

interface UserInputProps {
  onSearch: (city: string) => void;
}

const UserInput: React.FC<UserInputProps> = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    if (city.trim()) {
      onSearch(city);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && city.trim()) {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center justify-center w-full my-4">
      <div className="flex w-full max-w-md shadow-md rounded-lg overflow-hidden">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter city name"
          className="p-3 flex-grow bg-white text-gray-800 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="theme-button px-4 py-3 whitespace-nowrap"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default UserInput;
