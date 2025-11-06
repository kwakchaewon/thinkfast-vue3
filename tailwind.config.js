/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary 색상 (Vuetify primary → Tailwind)
        primary: {
          DEFAULT: '#3949AB', // 딥 인디고
          50: '#E8EAF6',
          100: '#C5CAE9',
          200: '#9FA8DA',
          300: '#7986CB',
          400: '#5C6BC0',
          500: '#3949AB',
          600: '#303F9F',
          700: '#283593',
          800: '#1A237E',
          900: '#0D47A1',
        },
        // Secondary 색상 (Vuetify secondary → Tailwind)
        secondary: {
          DEFAULT: '#5C6BC0', // 밝은 인디고
          foreground: 'hsl(var(--secondary-foreground))',
        },
        // Accent 색상 (Vuetify accent → Tailwind)
        accent: {
          DEFAULT: '#1A237E', // 진한 인디고
          foreground: 'hsl(var(--accent-foreground))',
        },
        // Error 색상 (Vuetify error → Tailwind)
        error: {
          DEFAULT: '#FF5252',
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#FF5252',
          600: '#E53935',
          700: '#D32F2F',
          800: '#C62828',
          900: '#B71C1C',
        },
        // Info 색상 (Vuetify info → Tailwind)
        info: {
          DEFAULT: '#2196F3',
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#2196F3',
          600: '#1E88E5',
          700: '#1976D2',
          800: '#1565C0',
          900: '#0D47A1',
        },
        // Success 색상 (Vuetify success → Tailwind)
        success: {
          DEFAULT: '#4CAF50',
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
        },
        // Warning 색상 (Vuetify warning → Tailwind)
        warning: {
          DEFAULT: '#FFC107',
          50: '#FFF8E1',
          100: '#FFECB3',
          200: '#FFE082',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#FFC107',
          600: '#FFB300',
          700: '#FFA000',
          800: '#FF8F00',
          900: '#FF6F00',
        },
        // shadcn-vue 색상 시스템
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: '8px',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      // 타이포그래피 스케일
      fontSize: {
        'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['1.75rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h5': ['1.25rem', { lineHeight: '1.5', fontWeight: '600' }],
        'h6': ['1.125rem', { lineHeight: '1.5', fontWeight: '600' }],
      },
      // 그림자 시스템
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      // 간격 시스템 (4px 단위 유지, Tailwind 기본값과 동일)
      spacing: {
        // 기본값 사용 (4px 단위)
      },
      // 반응형 breakpoint (Tailwind 기본값과 동일하지만 명시적으로 정의)
      screens: {
        'sm': '640px',   // Small devices
        'md': '768px',   // Medium devices
        'lg': '1024px',  // Large devices
        'xl': '1280px',  // Extra large devices
        '2xl': '1536px', // 2X Extra large devices
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

