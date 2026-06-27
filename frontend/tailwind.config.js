/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        cyber: {
          bg:      'var(--cyber-bg)',
          card:    'var(--cyber-card)',
          border:  'var(--cyber-border)',
          text:    'var(--cyber-text)',
          primary: 'var(--cyber-primary)',
          secondary:'var(--cyber-secondary)',
          danger:  'var(--cyber-danger)',
          warning: 'var(--cyber-warning)',
          accent:  'var(--cyber-accent)',
        },
      },
      boxShadow: {
        glow:     '0 0 20px rgba(37,99,235,0.3)',
        'glow-lg':'0 0 40px rgba(37,99,235,0.4)',
        card:     '0 4px 24px -4px rgba(15,23,42,0.08)',
      },
      animation: {
        'spin-slow':    'spinSlow 8s linear infinite',
        'float':        'floatShield 4s ease-in-out infinite',
        'fade-in-up':   'fadeInUp 0.5s ease forwards',
        'slide-in':     'slideIn 0.3s ease forwards',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-mesh':       "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563EB' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
