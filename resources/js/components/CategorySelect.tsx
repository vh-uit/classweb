import React from 'react';
import { cn } from '@/lib/utils';

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

  return (
    <div className="space-y-2">
      <div className={cn("relative", className)}>
        {/* Selected categories display */}
        <div className="min-h-[2.5rem] w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2">
          {selectedCategories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {categories
                .filter(cat => selectedCategories.includes(cat.id))
                .map(category => (
                  <span
                    key={category.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-md"
                  >
                    {category.color && (
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                    )}
                    {category.name}
                    <button
                      type="button"
                      onClick={() => handleCategoryToggle(category.id)}
                      className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 transition-colors"
                      title="Remove category"
                    >
                      ×
                    </button>
                  </span>
                ))}
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400 text-sm py-1">
              {placeholder}
            </div>
          )}
        </div>

        {/* Available categories */}
        <div className="mt-3 space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Available Categories:
          </h4>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const isSelected = selectedCategories.includes(category.id);
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryToggle(category.id)}
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors",
                    isSelected
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                  )}
                >
                  {category.color && (
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                  )}
                  {category.name}
                  {isSelected && (
                    <span className="ml-1 text-xs">✓</span>
                  )}
                </button>
              );
            })}
          </div>
          
          {categories.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              No categories available. Please create some categories first.
            </p>
          )}
        </div>
      </div>

      {/* Helper text */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {multiple 
          ? `${selectedCategories.length} ${selectedCategories.length === 1 ? 'category' : 'categories'} selected`
          : selectedCategories.length > 0 
            ? `Selected: ${getSelectedCategoryNames()}`
            : 'No category selected'
        }
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

export default CategorySelect;
