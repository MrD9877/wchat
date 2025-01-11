/** @type {import('tailwindcss').Config} */
const model = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        weblue: "#27b1b2",
        weChat: "#B5E2E2",
      },
      backgroundImage: {
        chatPattern: "url('/chatpageBg.png')",
      },
      fontSize: {
        xxs: "8",
      },
      lineHeight: {
        xxs: "10",
      },
    },
  },
  plugins: [],
};
export default model;
