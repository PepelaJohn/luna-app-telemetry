// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
      './pages/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
      './app/**/*.{ts,tsx}',
      './src/**/*.{ts,tsx}',
    ],
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        colors: {
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary))",
            foreground: "hsl(var(--secondary-foreground))",
          },
          destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
          },
          muted: {
            DEFAULT: "hsl(var(--muted))",
            foreground: "hsl(var(--muted-foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--accent))",
            foreground: "hsl(var(--accent-foreground))",
          },
          popover: {
            DEFAULT: "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))",
          },
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
          // Drone status colors
          drone: {
            'powered-off': '#6b7280',
            'standby': '#eab308',
            'pre-flight': '#3b82f6',
            'active': '#22c55e',
            'in-flight': '#06b6d4',
            'landing': '#f97316',
            'delivered': '#16a34a',
            'returning': '#a855f7',
            'maintenance': '#ea580c',
            'emergency': '#dc2626',
          },
          // Gauge colors
          gauge: {
            'good': '#22c55e',
            'warning': '#eab308', 
            'danger': '#ef4444',
            'info': '#3b82f6',
            'neutral': '#6b7280',
          },
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui'],
          mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular'],
        },
        fontSize: {
          'xs': ['0.75rem', { lineHeight: '1rem' }],
          'sm': ['0.875rem', { lineHeight: '1.25rem' }],
          'base': ['1rem', { lineHeight: '1.5rem' }],
          'lg': ['1.125rem', { lineHeight: '1.75rem' }],
          'xl': ['1.25rem', { lineHeight: '1.75rem' }],
          '2xl': ['1.5rem', { lineHeight: '2rem' }],
          '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
          '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        },
        spacing: {
          '18': '4.5rem',
          '88': '22rem',
          '128': '32rem',
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'slide-up': 'slideUp 0.3s ease-out',
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'spin-slow': 'spin 3s linear infinite',
          'bounce-subtle': 'bounceSubtle 2s infinite',
          'glow': 'glow 2s ease-in-out infinite alternate',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideUp: {
            '0%': { transform: 'translateY(10px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          bounceSubtle: {
            '0%, 100%': {
              transform: 'translateY(-5%)',
              animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
            },
            '50%': {
              transform: 'translateY(0)',
              animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
            },
          },
          glow: {
            '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
            '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
          },
        },
        backdropBlur: {
          xs: '2px',
        },
        boxShadow: {
          'glow-sm': '0 0 10px rgba(59, 130, 246, 0.3)',
          'glow-md': '0 0 20px rgba(59, 130, 246, 0.4)',
          'glow-lg': '0 0 30px rgba(59, 130, 246, 0.5)',
          'inner-light': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        },
        gradientColorStops: {
          'primary-light': 'rgba(59, 130, 246, 0.1)',
          'primary-dark': 'rgba(59, 130, 246, 0.8)',
        },
        screens: {
          'xs': '475px',
          '3xl': '1600px',
        },
        zIndex: {
          '60': '60',
          '70': '70',
          '80': '80',
          '90': '90',
          '100': '100',
        },
        transitionProperty: {
          'height': 'height',
          'spacing': 'margin, padding',
        },
        scale: {
          '102': '1.02',
        },
      },
    },
    plugins: [
      // Custom plugin for drone dashboard utilities
      function({ addUtilities, addComponents, theme }) {
        const newUtilities = {
          // Gauge utilities
          '.gauge-container': {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          '.gauge-value': {
            position: 'absolute',
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'hsl(var(--foreground))',
            fontFeatureSettings: '"tnum" 1',
          },
          '.gauge-label': {
            marginTop: '0.5rem',
            textAlign: 'center',
            color: 'hsl(var(--muted-foreground))',
            fontSize: '0.75rem',
            fontWeight: '500',
          },
          
          // Status indicators
          '.status-indicator': {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
          '.status-online': {
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            color: 'rgb(34, 197, 94)',
          },
          '.status-offline': {
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: 'rgb(239, 68, 68)',
          },
          
          // Card hover effects
          '.card-hover': {
            transition: 'all 0.2s ease-in-out',
          },
          '.card-hover:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.3)',
          },
          
          // Scrollbar styling
          '.custom-scrollbar': {
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'hsl(var(--background))',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'hsl(var(--border))',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'hsl(var(--muted-foreground))',
            },
          },
          
          // Glass morphism
          '.glass': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          
          // Navigation transitions
          '.nav-transition': {
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        };
  
        const newComponents = {
          // Dashboard card component
          '.dashboard-card': {
            backgroundColor: 'hsl(var(--card))',
            borderRadius: 'calc(var(--radius) + 2px)',
            border: '1px solid hsl(var(--border))',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          },
          
          // Metric display
          '.metric-display': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            borderRadius: 'calc(var(--radius))',
            backgroundColor: 'hsl(var(--muted))',
          },
          
          // Button variants for drone controls
          '.btn-drone-control': {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'calc(var(--radius))',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s',
            padding: '0.5rem 1rem',
            border: '1px solid transparent',
          },
          '.btn-drone-active': {
            backgroundColor: theme('colors.drone.active'),
            color: 'white',
            '&:hover': {
              backgroundColor: theme('colors.green.600'),
            },
          },
          '.btn-drone-emergency': {
            backgroundColor: theme('colors.drone.emergency'),
            color: 'white',
            '&:hover': {
              backgroundColor: theme('colors.red.700'),
            },
          },
        };
  
        addUtilities(newUtilities);
        addComponents(newComponents);
      },
    ],
  }
  
  // postcss.config.js
  module.exports = {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  }
  
  // package.json (dependencies section - add if missing)
  /*
  {
    "devDependencies": {
      "tailwindcss": "^3.4.0",
      "autoprefixer": "^10.4.0",
      "postcss": "^8.4.0"
    }
  }
  */