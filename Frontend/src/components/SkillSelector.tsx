import React, { useState, useRef, useEffect } from 'react';
import { PREDEFINED_SKILLS, PredefinedSkill } from '../services/skillsCatalogue';

interface SkillSelectorProps {
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
  disabled?: boolean;
}

export const SkillSelector: React.FC<SkillSelectorProps> = ({
  selectedSkills,
  onChange,
  disabled = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter skills based on search term and exclude already selected ones
  const filteredSuggestions: PredefinedSkill[] = PREDEFINED_SKILLS.filter((skill) => {
    const isAlreadySelected = selectedSkills.some(
      (s) => s.toLowerCase() === skill.name.toLowerCase()
    );
    if (isAlreadySelected) return false;

    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      skill.name.toLowerCase().includes(term) ||
      skill.category.toLowerCase().includes(term)
    );
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSkill = (skillName: string) => {
    if (!selectedSkills.includes(skillName)) {
      onChange([...selectedSkills, skillName]);
    }
    setSearchTerm('');
    setHighlightedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(selectedSkills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
        handleSelectSkill(filteredSuggestions[highlightedIndex].name);
      } else if (filteredSuggestions.length > 0 && searchTerm.trim()) {
        handleSelectSkill(filteredSuggestions[0].name);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    } else if (e.key === 'Backspace' && !searchTerm && selectedSkills.length > 0) {
      // Remove last skill if backspace pressed on empty search input
      handleRemoveSkill(selectedSkills[selectedSkills.length - 1]);
    }
  };

  return (
    <div className="position-relative" ref={containerRef}>
      <label className="form-label fw-bold small text-dark d-flex justify-content-between align-items-center">
        <span>Technical Skills (Predefined Industry Catalogue)</span>
        <span className="text-muted small fw-normal">
          {selectedSkills.length} selected
        </span>
      </label>

      {/* SEARCH INPUT BAR */}
      <div
        className={`nexus-input d-flex align-items-center bg-white p-2 border border-2 border-dark rounded-3 ${
          isOpen ? 'shadow-sm border-success' : ''
        }`}
        style={{ cursor: disabled ? 'not-allowed' : 'text' }}
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
            inputRef.current?.focus();
          }
        }}
      >
        <span className="text-muted me-2">🔍</span>
        <input
          ref={inputRef}
          type="text"
          className="border-0 bg-transparent flex-grow-1 p-0 small fw-semibold"
          placeholder={
            disabled
              ? 'Switch to Edit Profile to change skills'
              : selectedSkills.length === 0
              ? 'Click to browse or type skill (e.g. Spring Boot, React, Python)...'
              : 'Type to add more skills...'
          }
          style={{ outline: 'none', boxShadow: 'none' }}
          value={searchTerm}
          disabled={disabled}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => {
            if (!disabled) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
        {searchTerm && (
          <button
            type="button"
            className="btn btn-sm btn-link text-muted p-0 me-1"
            onClick={(e) => {
              e.stopPropagation();
              setSearchTerm('');
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* DROPDOWN MENU */}
      {isOpen && !disabled && (
        <div
          className="position-absolute start-0 end-0 mt-2 bg-white rounded-3 border border-2 border-dark shadow-lg py-2"
          style={{
            maxHeight: '270px',
            overflowY: 'auto',
            zIndex: 1060,
            boxShadow: '4px 4px 0px #1E293B'
          }}
        >
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.slice(0, 30).map((skill, index) => {
              const isHighlighted = index === highlightedIndex;
              return (
                <div
                  key={skill.name}
                  className={`px-3 py-2 d-flex justify-content-between align-items-center ${
                    isHighlighted ? 'bg-light text-success fw-bold' : 'text-dark'
                  }`}
                  style={{ cursor: 'pointer', transition: 'background-color 0.1s ease' }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => handleSelectSkill(skill.name)}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-semibold small">{skill.name}</span>
                  </div>
                  <span
                    className="badge rounded-pill bg-light text-muted border border-secondary-subtle px-2 py-1"
                    style={{ fontSize: '0.7rem' }}
                  >
                    {skill.category}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="p-3 text-center text-muted small">
              <div>🚫 No matching skills found in the catalogue.</div>
              <div className="mt-1" style={{ fontSize: '0.75rem' }}>
                Only skills from the standardized curriculum are selectable.
              </div>
            </div>
          )}
        </div>
      )}

      {/* SELECTED SKILLS CAPSULES DISPLAY */}
      <div className="d-flex flex-wrap gap-2 mt-3 align-items-center">
        {selectedSkills.length > 0 ? (
          selectedSkills.map((skill) => (
            <span key={skill} className="badge-pill-green">
              {skill}
              {!disabled && (
                <button
                  type="button"
                  className="btn btn-link btn-sm p-0 ms-2 text-danger text-decoration-none fw-bold"
                  style={{ lineHeight: 1 }}
                  title={`Remove ${skill}`}
                  onClick={() => handleRemoveSkill(skill)}
                >
                  ✕
                </button>
              )}
            </span>
          ))
        ) : (
          <span className="text-muted small fst-italic">
            No technical skills selected yet.
          </span>
        )}
      </div>
    </div>
  );
};
