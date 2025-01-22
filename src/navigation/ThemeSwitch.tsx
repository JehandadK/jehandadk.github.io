import { useEffect, useState } from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';

import { useTheme } from '../context/ThemeContext';

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <DarkModeSwitch
      onChange={toggleTheme}
      checked={theme === 'dark'}
      size={24}
      className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      moonColor="currentColor"
      sunColor="currentColor"
    />
  );
};

export { ThemeSwitch };
