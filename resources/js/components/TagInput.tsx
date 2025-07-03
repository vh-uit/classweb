import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  maxTags?: number;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = "Add tags... (press Enter to add)",
  className,
  error,
  maxTags = 10,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tagName: string) => {
    const trimmedTag = tagName.trim();
    if (
      trimmedTag &&
      !tags.includes(trimmedTag) &&
      tags.length < maxTags &&
      trimmedTag.length <= 50
    ) {
      onChange([...tags, trimmedTag]);
    }
    setInputValue('');
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
      case ',':
        e.preventDefault();
        addTag(inputValue);
        break;
      case 'Backspace':
        if (inputValue === '' && tags.length > 0) {
          removeTag(tags.length - 1);
        }
        break;
      case 'Escape':
        setInputValue('');
        inputRef.current?.blur();
        break;
    }
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "min-h-[2.5rem] w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 cursor-text transition-colors",
          "focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent",
          isInputFocused && "ring-2 ring-blue-500 border-transparent",
          error && "border-red-500 focus-within:ring-red-500",
          className
        )}
        onClick={focusInput}
      >
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-md group"
            >
              <span className="max-w-xs truncate">#{tag}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                className="flex-shrink-0 ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 transition-colors"
                title="Remove tag"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsInputFocused(true)}
            onBlur={handleInputBlur}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            disabled={tags.length >= maxTags}
          />
        </div>
      </div>
      
      {/* Helper text */}
      <div className="flex justify-between items-center text-xs">
        <div className="text-gray-500 dark:text-gray-400">
          {tags.length > 0 && (
            <span>
              {tags.length}/{maxTags} tags • Press Enter, comma, or Tab to add
            </span>
          )}
          {tags.length === 0 && (
            <span>Press Enter, comma, or Tab to add tags</span>
          )}
        </div>
        {tags.length >= maxTags && (
          <span className="text-amber-600 dark:text-amber-400">
            Maximum tags reached
          </span>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default TagInput;
