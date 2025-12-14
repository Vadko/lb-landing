"use client";

import { useState, useEffect, useRef } from "react";

interface GamesSearchProps {
  value: string;
  onChange: (value: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
}

const STATUS_OPTIONS = [
  { value: "all", label: "Усі ігри", icon: "fa-solid fa-gamepad" },
  { value: "completed", label: "Готово", icon: "fa-solid fa-check-circle" },
  { value: "in-progress", label: "В розробці", icon: "fa-solid fa-spinner" },
  { value: "planned", label: "Заплановано", icon: "fa-solid fa-clock" },
];

export function GamesSearch({
  value,
  onChange,
  status,
  onStatusChange,
}: GamesSearchProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption =
    STATUS_OPTIONS.find((opt) => opt.value === status) || STATUS_OPTIONS[0];

  const handleSelect = (optionValue: string) => {
    onStatusChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="games-filters">
      <div className="search-wrapper">
        <i className="fa-solid fa-magnifying-glass" />
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder="Пошук ігор..."
          className="search-input"
        />
      </div>

      <div className="custom-dropdown" ref={dropdownRef}>
        <button
          type="button"
          className={`dropdown-trigger ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className={selectedOption.icon} />
          <span>{selectedOption.label}</span>
          <i
            className={`fa-solid fa-chevron-down dropdown-arrow ${isOpen ? "rotated" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`dropdown-item ${status === option.value ? "active" : ""}`}
                onClick={() => handleSelect(option.value)}
              >
                <i className={option.icon} />
                <span>{option.label}</span>
                {status === option.value && <i className="fa-solid fa-check" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
