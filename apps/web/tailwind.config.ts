import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        app: "var(--bg-app)",
        surface: "var(--bg-surface)",
        subtle: "var(--bg-subtle)",
        border: "var(--border-color)",
        main: "var(--text-main)",
        muted: "var(--text-muted)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          foreground: "var(--primary-fg)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-fg)",
        },
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-fg)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          foreground: "var(--warning-fg)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-fg)",
        },
        // Backward compatibility
        brand: {
          emerald: "var(--primary)",
          gold: "var(--accent)",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
    },
  },
  plugins: [],
};

export default config;
