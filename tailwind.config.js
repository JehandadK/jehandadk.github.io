module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    extend: {
      colors: {
        primary: {
          100: '#E6F6FE',
          200: '#C0EAFC',
          300: '#9ADDFB',
          400: '#4FC3F7',
          500: '#03A9F4',
          600: '#0398DC',
          700: '#026592',
          800: '#014C6E',
          900: '#013349',
        },
        gray: {
          100: '#f7fafc',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#4a5568',
          800: '#2d3748',
          900: '#1a202c',

          // Dark mode colors
          DEFAULT: '#374151', // Set this as the default dark gray
          'dark-100': '#1F2937', // Darker than gray-500
          'dark-200': '#111827', // Darker than gray-700
        },
        // You can define additional colors for dark theme here
        dark: {
          100: '#f1f5f9', // Light gray for dark mode
          200: '#d1d5db', // Gray for dark mode
          300: '#9ca3af', // Medium gray for dark mode
          400: '#6b7280', // Dark gray for dark mode
          500: '#4b5563', // Darker gray for dark mode
          600: '#374151', // Darker gray for dark mode
          700: '#1f2937', // Dark gray for dark mode
          800: '#1a202c', // Very dark gray for dark mode
          900: '#0f172a', // Almost black for dark mode
        },
      },
      lineHeight: {
        hero: '4.5rem',
      },
    },
  },
  darkMode: 'class', // or 'media' based on your preference
  plugins: [],
};
