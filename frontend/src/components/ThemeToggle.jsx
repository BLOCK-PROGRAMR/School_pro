import React, { useContext } from 'react';
import { ThemeContext } from '../store/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="p-2 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50
                 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white
                 bg-white hover:bg-gray-100 text-gray-800 shadow-md"
    >
      {theme === 'light' ? (
        <Moon size={20} className="text-blue-800" />
      ) : (
        <Sun size={20} className="text-yellow-400" />
      )}
    </button>
  );
};

export default ThemeToggle; 