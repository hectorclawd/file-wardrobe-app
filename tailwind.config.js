/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream:          'rgb(var(--cream-rgb) / <alpha-value>)',
        ink:            'rgb(var(--ink-rgb) / <alpha-value>)',
        muted:          'rgb(var(--muted-rgb) / <alpha-value>)',
        surface:        'rgb(var(--surface-rgb) / <alpha-value>)',
        card:           'rgb(var(--card-rgb) / <alpha-value>)',
        accent:         'rgb(var(--accent-rgb) / <alpha-value>)',
        'accent-light': 'rgb(var(--accent-light-rgb) / <alpha-value>)',
        'profile-1':    'rgb(var(--profile-1-rgb) / <alpha-value>)',
        'profile-2':    'rgb(var(--profile-2-rgb) / <alpha-value>)',
        'profile-3':    'rgb(var(--profile-3-rgb) / <alpha-value>)',
        'profile-4':    'rgb(var(--profile-4-rgb) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        sm:   '8px',
        md:   '12px',
        lg:   '20px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(28, 26, 23, 0.08)',
        lift: '0 8px 32px rgba(28, 26, 23, 0.14)',
      },
    },
  },
  plugins: [],
}
