import React, { useState, KeyboardEvent, useRef, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  EyeSlashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Focus mode toggle
  const toggleFocusMode = useCallback(() => {
    setIsFocusMode(!isFocusMode);
  }, [isFocusMode]);

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
        if (isFullscreen) {
          setIsFullscreen(false);
        } else if (isFocusMode) {
          setIsFocusMode(false);
        } else {
          setInputValue('');
          inputRef.current?.blur();
        }
        break;
    }
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // F11 for fullscreen
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
      // Ctrl/Cmd + Shift + F for focus mode
      if (e.key === 'F' && e.shiftKey && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggleFocusMode();
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('keydown', handleGlobalKeyDown as any);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('keydown', handleGlobalKeyDown as any);
      }
    };
  }, [isFullscreen, isFocusMode, toggleFullscreen, toggleFocusMode]);

  const handleInputBlur = () => {
    setIsInputFocused(false);
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const containerClasses = cn(
    'transition-all duration-300 ease-in-out',
    isFullscreen && 'fixed inset-0 z-50 bg-white dark:bg-gray-900 p-6 overflow-auto',
    isFocusMode && !isFullscreen && 'relative z-10 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg'
  );

  return (
    <div className={containerClasses} ref={containerRef} tabIndex={-1}>
      {/* Toolbar for focus/fullscreen modes */}
      {(isFocusMode || isFullscreen) && (
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Tag Input
          </h3>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleFocusMode}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              title={`${isFocusMode ? 'Exit' : 'Enter'} Focus Mode (Ctrl+Shift+F)`}
            >
              {isFocusMode ? (
                <EyeIcon className="h-4 w-4" />
              ) : (
                <EyeSlashIcon className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              title={`${isFullscreen ? 'Exit' : 'Enter'} Fullscreen (F11)`}
            >
              {isFullscreen ? (
                <ArrowsPointingInIcon className="h-4 w-4" />
              ) : (
                <ArrowsPointingOutIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {/* Toolbar for normal mode */}
        {!isFocusMode && !isFullscreen && (
          <div className="flex items-center justify-between mb-2">
            <div></div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleFocusMode}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 h-6 w-6 p-0"
                title="Enter Focus Mode (Ctrl+Shift+F)"
              >
                <EyeSlashIcon className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 h-6 w-6 p-0"
                title="Enter Fullscreen (F11)"
              >
                <ArrowsPointingOutIcon className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        <div
          className={cn(
            "min-h-[2.5rem] w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 cursor-text transition-colors",
            "focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent",
            isInputFocused && "ring-2 ring-blue-500 border-transparent",
            error && "border-red-500 focus-within:ring-red-500",
            (isFocusMode || isFullscreen) && "min-h-[3rem] p-3",
            !isFullscreen && !isFocusMode && className
          )}
          onClick={focusInput}
        >
          <div className={cn(
            "flex flex-wrap gap-1.5",
            (isFocusMode || isFullscreen) && "gap-2"
          )}>
            {tags.map((tag, index) => (
              <span
                key={index}
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-md group",
                  (isFocusMode || isFullscreen) && "px-3 py-2 text-base"
                )}
              >
                <span className="max-w-xs truncate">#{tag}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(index);
                  }}
                  className={cn(
                    "flex-shrink-0 ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 transition-colors",
                    (isFocusMode || isFullscreen) && "ml-2"
                  )}
                  title="Remove tag"
                >
                  <X className={cn(
                    "w-3 h-3",
                    (isFocusMode || isFullscreen) && "w-4 h-4"
                  )} />
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
              className={cn(
                "flex-1 min-w-[120px] outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
                (isFocusMode || isFullscreen) && "text-base"
              )}
              disabled={tags.length >= maxTags}
            />
          </div>
        </div>
        
        {/* Helper text */}
        <div className={cn(
          "flex justify-between items-center text-xs",
          (isFocusMode || isFullscreen) && "text-sm"
        )}>
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
          <div className={cn(
            "flex items-center gap-2 text-red-600 dark:text-red-400 text-sm",
            (isFocusMode || isFullscreen) && "text-base"
          )}>
            <svg className={cn(
              "w-4 h-4",
              (isFocusMode || isFullscreen) && "w-5 h-5"
            )} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Keyboard shortcuts hint */}
        {(isFocusMode || isFullscreen) && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Keyboard Shortcuts:
            </h5>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">F11</kbd> - Toggle Fullscreen</li>
              <li><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+Shift+F</kbd> - Toggle Focus Mode</li>
              <li><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Escape</kbd> - Exit Current Mode</li>
              <li><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Enter/Comma</kbd> - Add Tag</li>
              <li><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Backspace</kbd> - Remove Last Tag (when input is empty)</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagInput;
