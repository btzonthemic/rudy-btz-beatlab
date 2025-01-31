import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'glitch-1': {
          '0%': { transform: 'none', opacity: '0.75' },
          '7%': { transform: 'translate(2px, 3px)', opacity: '0.75' },
          '10%': { transform: 'none', opacity: '0.75' },
          '27%': { transform: 'none', opacity: '0.75' },
          '30%': { transform: 'translate(5px, 2px)', opacity: '0.75' },
          '35%': { transform: 'none', opacity: '0.75' },
          '52%': { transform: 'none', opacity: '0.75' },
          '55%': { transform: 'translate(3px, 1px)', opacity: '0.75' },
          '50%': { transform: 'none', opacity: '0.75' },
          '72%': { transform: 'none', opacity: '0.75' },
          '75%': { transform: 'translate(2px, 6px)', opacity: '0.75' },
          '80%': { transform: 'none', opacity: '0.75' },
          '100%': { transform: 'none', opacity: '0.75' }
        },
        'glitch-2': {
          '0%': { transform: 'none', opacity: '0.75' },
          '7%': { transform: 'translate(-2px, -3px)', opacity: '0.75' },
          '10%': { transform: 'none', opacity: '0.75' },
          '27%': { transform: 'none', opacity: '0.75' },
          '30%': { transform: 'translate(-5px, -2px)', opacity: '0.75' },
          '35%': { transform: 'none', opacity: '0.75' },
          '52%': { transform: 'none', opacity: '0.75' },
          '55%': { transform: 'translate(-3px, -1px)', opacity: '0.75' },
          '50%': { transform: 'none', opacity: '0.75' },
          '72%': { transform: 'none', opacity: '0.75' },
          '75%': { transform: 'translate(-2px, -6px)', opacity: '0.75' },
          '80%': { transform: 'none', opacity: '0.75' },
          '100%': { transform: 'none', opacity: '0.75' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'glitch-1': 'glitch-1 3s infinite linear alternate-reverse',
        'glitch-2': 'glitch-2 3s infinite linear alternate-reverse'
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography")
  ],
} satisfies Config;