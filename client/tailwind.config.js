/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#eef7f7',
                    100: '#d5eded',
                    200: '#aedcdc',
                    300: '#7ec4c4',
                    400: '#4da8a8',
                    500: '#2d8a8a',
                    600: '#236e6e',
                    700: '#1f5858',
                    800: '#1c4848',
                    900: '#1a3c3c',
                    950: '#0a2121',
                },
                // Light theme (glassmorphic mint/teal like reference image)
                background: 'var(--color-background)',
                foreground: 'var(--color-foreground)',
                card: 'var(--color-card)',
                'card-foreground': 'var(--color-card-foreground)',
                border: 'var(--color-border)',
                muted: 'var(--color-muted)',
                'muted-foreground': 'var(--color-muted-foreground)',
                accent: 'var(--color-accent)',
                'accent-foreground': 'var(--color-accent-foreground)',
                sidebar: 'var(--color-sidebar)',
                'sidebar-foreground': 'var(--color-sidebar-foreground)',
            },
            backgroundImage: {
                'ai-gradient': 'linear-gradient(135deg, #2d8a8a, #4da8a8, #7ec4c4)',
                'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                'glass-lg': '0 16px 48px 0 rgba(31, 38, 135, 0.1)',
                'glass-inset': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
                'glow': '0 0 40px rgba(45, 138, 138, 0.15)',
                'glow-lg': '0 0 80px rgba(45, 138, 138, 0.2)',
            },
            animation: {
                'blob': 'blob 7s infinite',
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float 8s ease-in-out infinite',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
                'shimmer': 'shimmer 2s linear infinite',
                'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
                'gradient': 'gradient 8s ease infinite',
                'scan': 'scan 2s linear infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                scan: {
                    '0%': { top: '0%' },
                    '100%': { top: '100%' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            borderRadius: {
                '4xl': '2rem',
            },
        },
    },
    plugins: [],
};
