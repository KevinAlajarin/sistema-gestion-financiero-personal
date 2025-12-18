/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        income: '#10b981',
        expense: '#ef4444',
        primary: '#3b82f6',
        secondary: '#64748b',
        background: '#f8fafc',
        surface: '#ffffff',
      }
    },
  },
  plugins: [],
}