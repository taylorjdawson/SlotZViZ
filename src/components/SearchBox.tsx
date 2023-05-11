import React, { useState, KeyboardEvent, useEffect } from "react";

interface SearchBoxProps {
  callback?: (value: number) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ callback }) => {
  const [inputValue, setInputValue] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (event) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        setIsVisible(true);
      }
    };

    window.addEventListener("keydown", (event) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        setIsVisible(true);
      }
    });

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const num = Number(inputValue);
      if (!isNaN(num)) {
        callback?.(num);
        setInputValue("");
        setIsVisible(false);
      } else {
        alert("Input must be a number");
      }
    }
  };

  return isVisible ? (
    <div className="fixed inset-0 flex items-center justify-center">
      <input
        className="border border-gray-950 rounded-md px-4 py-2 bg-gray-900 outline-none"
        type="text"
        placeholder="goto slot"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </div>
  ) : null;
};

export default SearchBox;
