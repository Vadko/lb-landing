"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";

interface GamesSearchProps {
  value: string;
  onChange: (value: string) => void;
  // Multi-select statuses
  selectedStatuses: string[];
  onStatusesChange: (statuses: string[]) => void;
  // Multi-select authors
  selectedAuthors: string[];
  onAuthorsChange: (authors: string[]) => void;
  // Available authors list
  authors: string[];
  authorsLoading?: boolean;
}

const AUTHORS_PER_PAGE = 20;

const STATUS_OPTIONS = [
  { value: "completed", label: "Готово", icon: "fa-solid fa-check-circle" },
  { value: "in-progress", label: "В розробці", icon: "fa-solid fa-spinner" },
  { value: "planned", label: "Заплановано", icon: "fa-solid fa-clock" },
];

export function GamesSearch({
  value,
  onChange,
  selectedStatuses,
  onStatusesChange,
  selectedAuthors,
  onAuthorsChange,
  authors,
  authorsLoading,
}: GamesSearchProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isAuthorOpen, setIsAuthorOpen] = useState(false);
  const [authorSearch, setAuthorSearch] = useState("");
  const [authorsDisplayed, setAuthorsDisplayed] = useState(AUTHORS_PER_PAGE);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const authorDropdownRef = useRef<HTMLDivElement>(null);
  const authorListRef = useRef<HTMLDivElement>(null);
  const authorSearchInputRef = useRef<HTMLInputElement>(null);

  // Filter authors based on search
  const filteredAuthors = useMemo(() => {
    if (!authorSearch.trim()) return authors;
    const search = authorSearch.toLowerCase();
    return authors.filter((a) => a.toLowerCase().includes(search));
  }, [authors, authorSearch]);

  // Paginated authors to display
  const visibleAuthors = useMemo(() => {
    return filteredAuthors.slice(0, authorsDisplayed);
  }, [filteredAuthors, authorsDisplayed]);

  const hasMoreAuthors = useMemo(() => {
    return authorsDisplayed < filteredAuthors.length;
  }, [authorsDisplayed, filteredAuthors.length]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isAuthorOpen && authorSearchInputRef.current) {
      authorSearchInputRef.current.focus();
    }
  }, [isAuthorOpen]);

  // Handle search input change with pagination reset
  const handleAuthorSearchChange = useCallback((newValue: string) => {
    setAuthorSearch(newValue);
    setAuthorsDisplayed(AUTHORS_PER_PAGE);
  }, []);

  // Handle dropdown toggle with reset
  const handleAuthorDropdownToggle = useCallback(() => {
    if (isAuthorOpen) {
      setAuthorSearch("");
      setAuthorsDisplayed(AUTHORS_PER_PAGE);
    }
    setIsAuthorOpen(!isAuthorOpen);
  }, [isAuthorOpen]);

  // Infinite scroll handler for authors
  const handleAuthorScroll = useCallback(() => {
    if (!authorListRef.current || !hasMoreAuthors) return;

    const { scrollTop, scrollHeight, clientHeight } = authorListRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setAuthorsDisplayed((prev) => prev + AUTHORS_PER_PAGE);
    }
  }, [hasMoreAuthors]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusOpen(false);
      }
      if (
        authorDropdownRef.current &&
        !authorDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAuthorOpen(false);
        setAuthorSearch("");
        setAuthorsDisplayed(AUTHORS_PER_PAGE);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle status selection
  const handleStatusToggle = (statusValue: string) => {
    if (selectedStatuses.includes(statusValue)) {
      onStatusesChange(selectedStatuses.filter((s) => s !== statusValue));
    } else {
      onStatusesChange([...selectedStatuses, statusValue]);
    }
  };

  // Toggle author selection
  const handleAuthorToggle = (authorName: string) => {
    if (selectedAuthors.includes(authorName)) {
      onAuthorsChange(selectedAuthors.filter((a) => a !== authorName));
    } else {
      onAuthorsChange([...selectedAuthors, authorName]);
    }
  };

  // Clear all statuses
  const handleClearStatuses = () => {
    onStatusesChange([]);
    setIsStatusOpen(false);
  };

  // Clear all authors
  const handleClearAuthors = () => {
    onAuthorsChange([]);
    setIsAuthorOpen(false);
  };

  // Status button label
  const statusLabel = useMemo(() => {
    if (selectedStatuses.length === 0) return "Усі статуси";
    if (selectedStatuses.length === 1) {
      const opt = STATUS_OPTIONS.find((o) => o.value === selectedStatuses[0]);
      return opt?.label || selectedStatuses[0];
    }
    return `${selectedStatuses.length} статуси`;
  }, [selectedStatuses]);

  // Author button label
  const authorLabel = useMemo(() => {
    if (selectedAuthors.length === 0) return "Усі автори";
    if (selectedAuthors.length === 1) return selectedAuthors[0];
    return `${selectedAuthors.length} авторів`;
  }, [selectedAuthors]);

  return (
    <div className="games-filters-wrapper">
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

        {/* Status Multi-Select Dropdown */}
        <div className="custom-dropdown" ref={statusDropdownRef}>
          <button
            type="button"
            className={`dropdown-trigger ${isStatusOpen ? "open" : ""} ${selectedStatuses.length > 0 ? "has-value" : ""}`}
            onClick={() => setIsStatusOpen(!isStatusOpen)}
          >
            <i className="fa-solid fa-gamepad" />
            <span>{statusLabel}</span>
            <i
              className={`fa-solid fa-chevron-down dropdown-arrow ${isStatusOpen ? "rotated" : ""}`}
            />
          </button>

          {isStatusOpen && (
            <div className="dropdown-menu dropdown-menu-with-search">
              {/* Clear selection */}
              {selectedStatuses.length > 0 && (
                <button
                  type="button"
                  className="dropdown-item dropdown-item-clear"
                  onClick={handleClearStatuses}
                >
                  <i className="fa-solid fa-xmark" />
                  <span>Очистити фільтр</span>
                </button>
              )}
              {STATUS_OPTIONS.map((option) => {
                const isSelected = selectedStatuses.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`dropdown-item dropdown-item-checkbox ${isSelected ? "active" : ""}`}
                    onClick={() => handleStatusToggle(option.value)}
                  >
                    <span className={`checkbox ${isSelected ? "checked" : ""}`}>
                      {isSelected && <i className="fa-solid fa-check" />}
                    </span>
                    <i className={option.icon} />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Author Multi-Select Dropdown */}
        <div className="custom-dropdown" ref={authorDropdownRef}>
          <button
            type="button"
            className={`dropdown-trigger ${isAuthorOpen ? "open" : ""} ${selectedAuthors.length > 0 ? "has-value" : ""}`}
            onClick={handleAuthorDropdownToggle}
          >
            <i className="fa-solid fa-user" />
            <span>{authorLabel}</span>
            <i
              className={`fa-solid fa-chevron-down dropdown-arrow ${isAuthorOpen ? "rotated" : ""}`}
            />
          </button>

          {isAuthorOpen && (
            <div className="dropdown-menu dropdown-menu-with-search">
              {/* Search Input */}
              <div className="dropdown-search">
                <i className="fa-solid fa-magnifying-glass" />
                <input
                  ref={authorSearchInputRef}
                  type="text"
                  value={authorSearch}
                  onChange={(e) => handleAuthorSearchChange(e.target.value)}
                  placeholder="Пошук автора..."
                  className="dropdown-search-input"
                />
                {authorSearch && (
                  <button
                    type="button"
                    className="dropdown-search-clear"
                    onClick={() => setAuthorSearch("")}
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                )}
              </div>

              {/* Clear selection */}
              {selectedAuthors.length > 0 && !authorSearch && (
                <button
                  type="button"
                  className="dropdown-item dropdown-item-clear"
                  onClick={handleClearAuthors}
                >
                  <i className="fa-solid fa-xmark" />
                  <span>Очистити фільтр ({selectedAuthors.length})</span>
                </button>
              )}

              {/* Scrollable List */}
              <div
                ref={authorListRef}
                className="dropdown-list"
                onScroll={handleAuthorScroll}
              >
                {authorsLoading ? (
                  <div className="dropdown-loading">
                    <div className="spinner spinner-small" />
                  </div>
                ) : visibleAuthors.length === 0 ? (
                  <div className="dropdown-empty">
                    <span>Автора не знайдено</span>
                  </div>
                ) : (
                  <>
                    {visibleAuthors.map((authorName) => {
                      const isSelected = selectedAuthors.includes(authorName);
                      return (
                        <button
                          key={authorName}
                          type="button"
                          className={`dropdown-item dropdown-item-checkbox ${isSelected ? "active" : ""}`}
                          onClick={() => handleAuthorToggle(authorName)}
                        >
                          <span
                            className={`checkbox ${isSelected ? "checked" : ""}`}
                          >
                            {isSelected && <i className="fa-solid fa-check" />}
                          </span>
                          <i className="fa-solid fa-user" />
                          <span>{authorName}</span>
                        </button>
                      );
                    })}
                    {hasMoreAuthors && (
                      <div className="dropdown-loading">
                        <div className="spinner spinner-small" />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Results Count */}
              {!authorsLoading && authors.length > 0 && (
                <div className="dropdown-footer">
                  <span>
                    {authorSearch
                      ? `Знайдено: ${filteredAuthors.length}`
                      : `Всього: ${authors.length}`}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected filters chips - outside of flex container */}
      {(selectedStatuses.length > 0 || selectedAuthors.length > 0) && (
        <div className="filters-chips">
          {selectedStatuses.map((s) => {
            const opt = STATUS_OPTIONS.find((o) => o.value === s);
            return (
              <span key={s} className="filter-chip">
                {opt?.label || s}
                <button
                  type="button"
                  onClick={() => handleStatusToggle(s)}
                  className="filter-chip-remove"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </span>
            );
          })}
          {selectedAuthors.map((a) => (
            <span key={a} className="filter-chip filter-chip-author">
              {a}
              <button
                type="button"
                onClick={() => handleAuthorToggle(a)}
                className="filter-chip-remove"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
