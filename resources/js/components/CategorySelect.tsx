import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  EyeSlashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface Category {
  id: number;
  name: string;
  color?: string;
}

interface CategorySelectProps {
  categories: Category[];
  selectedCategories: number[];
  onChange: (categoryIds: number[]) => void;
  className?: string;
  error?: string;
  multiple?: boolean;
  placeholder?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  categories,
  selectedCategories,
  onChange,
  className,
  error,
  multiple = true,
  placeholder = "Select categories...",
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCategoryToggle = (categoryId: number) => {
    if (multiple) {
      if (selectedCategories.includes(categoryId)) {
        onChange(selectedCategories.filter(id => id !== categoryId));
      } else {
        onChange([...selectedCategories, categoryId]);
      }
    } else {
      onChange(selectedCategories.includes(categoryId) ? [] : [categoryId]);
    }
  };

  const getSelectedCategoryNames = () => {
    return categories
      .filter(cat => selectedCategories.includes(cat.id))
      .map(cat => cat.name)
      .join(', ');
  };

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Focus mode toggle
  const toggleFocusMode = useCallback(() => {
    setIsFocusMode(!isFocusMode);
  }, [isFocusMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      // Escape to exit modes
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else if (isFocusMode) {
          setIsFocusMode(false);
        }
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [isFullscreen, isFocusMode, toggleFullscreen, toggleFocusMode]);

  const containerClasses = cn(
    'transition-all duration-300 ease-in-out',
    isFullscreen && 'fixed inset-0 z-50 bg-white dark:bg-gray-900 p-6 overflow-auto',
    isFocusMode && !isFullscreen && 'relative z-10 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg',
    className
  );

  return (
    <div className={containerClasses} ref={containerRef} tabIndex={-1}>
      {/* Toolbar for focus/fullscreen modes */}
      {(isFocusMode || isFullscreen) && (
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Category Selection
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
        <div className={cn("relative", !isFullscreen && !isFocusMode && className)}>
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

          {/* Selected categories display */}
          <div className={cn(
            "min-h-[2.5rem] w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2",
            (isFocusMode || isFullscreen) && "min-h-[3rem] p-3"
          )}>
            {selectedCategories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {categories
                  .filter(cat => selectedCategories.includes(cat.id))
                  .map(category => (
                    <span
                      key={category.id}
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-md",
                        (isFocusMode || isFullscreen) && "px-3 py-2 text-base"
                      )}
                    >
                      {category.color && (
                        <div 
                          className={cn(
                            "w-2 h-2 rounded-full",
                            (isFocusMode || isFullscreen) && "w-3 h-3"
                          )}
                          style={{ backgroundColor: category.color }}
                        />
                      )}
                      {category.name}
                      <button
                        type="button"
                        onClick={() => handleCategoryToggle(category.id)}
                        className={cn(
                          "ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 transition-colors",
                          (isFocusMode || isFullscreen) && "ml-2 text-lg"
                        )}
                        title="Remove category"
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>
            ) : (
              <div className={cn(
                "text-gray-500 dark:text-gray-400 text-sm py-1",
                (isFocusMode || isFullscreen) && "text-base py-2"
              )}>
                {placeholder}
              </div>
            )}
          </div>

          {/* Available categories */}
          <div className="mt-3 space-y-2">
            <h4 className={cn(
              "text-sm font-medium text-gray-700 dark:text-gray-300",
              (isFocusMode || isFullscreen) && "text-base"
            )}>
              Available Categories:
            </h4>
            <div className={cn(
              "flex flex-wrap gap-2",
              (isFocusMode || isFullscreen) && "gap-3"
            )}>
              {categories.map(category => {
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryToggle(category.id)}
                    className={cn(
                      "inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors",
                      (isFocusMode || isFullscreen) && "px-4 py-2 text-base",
                      isSelected
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700"
                        : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                    )}
                  >
                    {category.color && (
                      <div 
                        className={cn(
                          "w-2 h-2 rounded-full",
                          (isFocusMode || isFullscreen) && "w-3 h-3"
                        )}
                        style={{ backgroundColor: category.color }}
                      />
                    )}
                    {category.name}
                    {isSelected && (
                      <span className={cn(
                        "ml-1 text-xs",
                        (isFocusMode || isFullscreen) && "ml-2 text-sm"
                      )}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
            
            {categories.length === 0 && (
              <p className={cn(
                "text-sm text-gray-500 dark:text-gray-400 italic",
                (isFocusMode || isFullscreen) && "text-base"
              )}>
                No categories available. Please create some categories first.
              </p>
            )}
          </div>
        </div>

        {/* Helper text */}
        <div className={cn(
          "text-xs text-gray-500 dark:text-gray-400",
          (isFocusMode || isFullscreen) && "text-sm"
        )}>
          {multiple 
            ? `${selectedCategories.length} ${selectedCategories.length === 1 ? 'category' : 'categories'} selected`
            : selectedCategories.length > 0 
              ? `Selected: ${getSelectedCategoryNames()}`
              : 'No category selected'
          }
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
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySelect;
