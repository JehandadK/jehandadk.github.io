import { useEffect, useState } from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';

const ThemeSwitch = () => {
  // Get initial theme from localStorage or default to light mode
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = window.localStorage.getItem('theme');
      setDarkMode(storedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      window.localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      window.localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <DarkModeSwitch
      onChange={handleToggle}
      checked={darkMode}
      size={80}
    />
  );
};

export { ThemeSwitch };
