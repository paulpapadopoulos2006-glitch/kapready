import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: { 50:'#fdfaf6', 100:'#f5efe6', 200:'#ecddd1', DEFAULT:'#fdfaf6' },
        navy:  { 50:'#f0ece9', 500:'#5c4f48', 700:'#3d312c', 900:'#1a100c', DEFAULT:'#2c2420' },
        gold:  { 100:'#f5ddd0', 300:'#d9a08a', 500:'#c1785b', 700:'#a05e44', DEFAULT:'#c1785b' },
        stone: { 200:'#d4c2b8', 400:'#8c7e78', 600:'#5c4f48', DEFAULT:'#8c7e78' },
        border:'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring:  'hsl(var(--ring))',
        background:'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary:    { DEFAULT:'hsl(var(--primary))',    foreground:'hsl(var(--primary-foreground))' },
        secondary:  { DEFAULT:'hsl(var(--secondary))',  foreground:'hsl(var(--secondary-foreground))' },
        muted:      { DEFAULT:'hsl(var(--muted))',      foreground:'hsl(var(--muted-foreground))' },
        accent:     { DEFAULT:'hsl(var(--accent))',     foreground:'hsl(var(--accent-foreground))' },
        card:       { DEFAULT:'hsl(var(--card))',       foreground:'hsl(var(--card-foreground))' },
        popover:    { DEFAULT:'hsl(var(--popover))',    foreground:'hsl(var(--popover-foreground))' },
        destructive:{ DEFAULT:'hsl(var(--destructive))',foreground:'hsl(var(--destructive-foreground))' },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': { from:{ height:'0' }, to:{ height:'var(--radix-accordion-content-height)' } },
        'accordion-up':   { from:{ height:'var(--radix-accordion-content-height)' }, to:{ height:'0' } },
        fadeUp: { from:{ opacity:'0', transform:'translateY(24px)' }, to:{ opacity:'1', transform:'translateY(0)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
