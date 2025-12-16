"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";

interface GamesSearchProps {
  value: string;
  onChange: (value: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  team?: string;
  onTeamChange: (team: string | undefined) => void;
  teams: string[];
  teamsLoading?: boolean;
}

const TEAMS_PER_PAGE = 20;

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
  team,
  onTeamChange,
  teams,
  teamsLoading,
}: GamesSearchProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [teamSearch, setTeamSearch] = useState("");
  const [teamsDisplayed, setTeamsDisplayed] = useState(TEAMS_PER_PAGE);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const teamDropdownRef = useRef<HTMLDivElement>(null);
  const teamListRef = useRef<HTMLDivElement>(null);
  const teamSearchInputRef = useRef<HTMLInputElement>(null);

  // Filter teams based on search
  const filteredTeams = useMemo(() => {
    if (!teamSearch.trim()) return teams;
    const search = teamSearch.toLowerCase();
    return teams.filter((t) => t.toLowerCase().includes(search));
  }, [teams, teamSearch]);

  // Paginated teams to display
  const visibleTeams = useMemo(() => {
    return filteredTeams.slice(0, teamsDisplayed);
  }, [filteredTeams, teamsDisplayed]);

  const hasMoreTeams = useMemo(() => {
    return teamsDisplayed < filteredTeams.length;
  }, [teamsDisplayed, filteredTeams.length])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isTeamOpen && teamSearchInputRef.current) {
      teamSearchInputRef.current.focus();
    }
  }, [isTeamOpen]);

  // Handle search input change with pagination reset
  const handleTeamSearchChange = useCallback((newValue: string) => {
    setTeamSearch(newValue);
    setTeamsDisplayed(TEAMS_PER_PAGE);
  }, []);

  // Handle dropdown toggle with reset
  const handleTeamDropdownToggle = useCallback(() => {
    if (isTeamOpen) {
      // Closing - reset state
      setTeamSearch("");
      setTeamsDisplayed(TEAMS_PER_PAGE);
    }
    setIsTeamOpen(!isTeamOpen);
  }, [isTeamOpen]);

  // Infinite scroll handler for teams
  const handleTeamScroll = useCallback(() => {
    if (!teamListRef.current || !hasMoreTeams) return;

    const { scrollTop, scrollHeight, clientHeight } = teamListRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setTeamsDisplayed((prev) => prev + TEAMS_PER_PAGE);
    }
  }, [hasMoreTeams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusOpen(false);
      }
      if (
        teamDropdownRef.current &&
        !teamDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTeamOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedStatusOption =
    STATUS_OPTIONS.find((opt) => opt.value === status) || STATUS_OPTIONS[0];

  const handleStatusSelect = (optionValue: string) => {
    onStatusChange(optionValue);
    setIsStatusOpen(false);
  };

  const handleTeamSelect = (teamValue: string | undefined) => {
    onTeamChange(teamValue);
    setIsTeamOpen(false);
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

      {/* Status Dropdown */}
      <div className="custom-dropdown" ref={statusDropdownRef}>
        <button
          type="button"
          className={`dropdown-trigger ${isStatusOpen ? "open" : ""}`}
          onClick={() => setIsStatusOpen(!isStatusOpen)}
        >
          <i className={selectedStatusOption.icon} />
          <span>{selectedStatusOption.label}</span>
          <i
            className={`fa-solid fa-chevron-down dropdown-arrow ${isStatusOpen ? "rotated" : ""}`}
          />
        </button>

        {isStatusOpen && (
          <div className="dropdown-menu">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`dropdown-item ${status === option.value ? "active" : ""}`}
                onClick={() => handleStatusSelect(option.value)}
              >
                <i className={option.icon} />
                <span>{option.label}</span>
                {status === option.value && <i className="fa-solid fa-check" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Team Dropdown */}
      <div className="custom-dropdown custom-dropdown-wide" ref={teamDropdownRef}>
        <button
          type="button"
          className={`dropdown-trigger ${isTeamOpen ? "open" : ""} ${team ? "has-value" : ""}`}
          onClick={handleTeamDropdownToggle}
        >
          <i className="fa-solid fa-user" />
          <span>{team || "Усі автори"}</span>
          <i
            className={`fa-solid fa-chevron-down dropdown-arrow ${isTeamOpen ? "rotated" : ""}`}
          />
        </button>

        {isTeamOpen && (
          <div className="dropdown-menu dropdown-menu-with-search">
            {/* Search Input */}
            <div className="dropdown-search">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                ref={teamSearchInputRef}
                type="text"
                value={teamSearch}
                onChange={(e) => handleTeamSearchChange(e.target.value)}
                placeholder="Пошук автора..."
                className="dropdown-search-input"
              />
              {teamSearch && (
                <button
                  type="button"
                  className="dropdown-search-clear"
                  onClick={() => setTeamSearch("")}
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              )}
            </div>

            {/* Scrollable List */}
            <div
              ref={teamListRef}
              className="dropdown-list"
              onScroll={handleTeamScroll}
            >
              {!teamSearch && (
                <button
                  type="button"
                  className={`dropdown-item ${!team ? "active" : ""}`}
                  onClick={() => handleTeamSelect(undefined)}
                >
                  <i className="fa-solid fa-users" />
                  <span>Усі автори</span>
                  {!team && <i className="fa-solid fa-check" />}
                </button>
              )}

              {teamsLoading ? (
                <div className="dropdown-loading">
                  <div className="spinner spinner-small" />
                </div>
              ) : visibleTeams.length === 0 ? (
                <div className="dropdown-empty">
                  <span>Автора не знайдено</span>
                </div>
              ) : (
                <>
                  {visibleTeams.map((teamName) => (
                    <button
                      key={teamName}
                      type="button"
                      className={`dropdown-item ${team === teamName ? "active" : ""}`}
                      onClick={() => handleTeamSelect(teamName)}
                    >
                      <i className="fa-solid fa-user" />
                      <span>{teamName}</span>
                      {team === teamName && <i className="fa-solid fa-check" />}
                    </button>
                  ))}
                  {hasMoreTeams && (
                    <div className="dropdown-loading">
                      <div className="spinner spinner-small" />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Results Count */}
            {!teamsLoading && teams.length > 0 && (
              <div className="dropdown-footer">
                <span>
                  {teamSearch
                    ? `Знайдено: ${filteredTeams.length}`
                    : `Всього: ${teams.length}`}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
