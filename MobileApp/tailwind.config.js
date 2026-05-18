// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0066CC", // Nice Blue
          success: "#228B22", // Forest Green
          danger: "#D32F2F", 
          warning: "#F57C00", 
        },
        surface: {
          bg: "#F8F7F2",      // Warm Off-white
          card: "#FFFFFF",
          muted: "#F0EFEA",
          input: "#FFFFFF",
        },
        text: {
          primary: "#1C1C1C", // Near Black
          secondary: "#555555", // Dark Gray
          muted: "#757575",
        },
      },
      fontSize: {
        // Specific sizes from User Typography Scale
        'small': ["15px", "22px"],
        'body': ["17px", "24px"],
        'base': ["18px", "26px"],
        'btn': ["20px", "28px"],
        'heading': ["22px", "30px"],
        'title': ["28px", "36px"],
        'amount': ["32px", "40px"],
      },
      spacing: {
        btn: "60px",
      },
    },
  },
  plugins: [],
};
