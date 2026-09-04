/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      './pages/**/*.{js,jsx}',
      './components/**/*.{js,jsx}',
      './app/**/*.{js,jsx}',
      './src/**/*.{js,jsx}',
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
                fontFamily: {
                        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
                        sans: ['Jost', 'system-ui', 'sans-serif'],
                },
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
                        },
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        },
                        forest: {
                                50: '#f0f7f4',
                                100: '#dcede5',
                                200: '#badbcb',
                                300: '#8ec3a8',
                                400: '#5ea482',
                                500: '#3d8663',
                                600: '#2d6a4f',
                                700: '#1b4332',
                                800: '#163829',
                                900: '#0e2d1f',
                        },
                        cream: {
                                50: '#fefdfb',
                                100: '#faf7f2',
                                200: '#f5f0e8',
                                300: '#ede5d8',
                                400: '#e0d4c0',
                                500: '#d0bea3',
                                600: '#b09770', // Darker for text
                                700: '#8d7556', // Even darker for text
                        },
                        gold: {
                                300: '#f0d68a',
                                400: '#e6c45a',
                                500: '#c9a84c',
                                600: '#a8893a',
                                700: '#8a6f2d',
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
                        'fade-in': {
                                from: { opacity: '0', transform: 'translateY(20px)' },
                                to: { opacity: '1', transform: 'translateY(0)' }
                        },
                        'slide-in': {
                                from: { opacity: '0', transform: 'translateX(-20px)' },
                                to: { opacity: '1', transform: 'translateX(0)' }
                        }
                },
                animation: {
                        'accordion-down': 'accordion-down 0.2s ease-out',
                        'accordion-up': 'accordion-up 0.2s ease-out',
                        'fade-in': 'fade-in 0.6s ease-out',
                        'slide-in': 'slide-in 0.4s ease-out'
                }
        }
    },
    plugins: [require("tailwindcss-animate")],
}
