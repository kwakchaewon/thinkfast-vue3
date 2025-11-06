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
      // 디자인 원칙: 명확한 시각적 계층으로 정보 전달
      // 
      // 커스텀 헤딩 스케일 (h1-h6):
      // - text-h1: 2.5rem (40px) - lineHeight: 1.2, fontWeight: 700 (주요 페이지 제목)
      // - text-h2: 2rem (32px) - lineHeight: 1.3, fontWeight: 600 (섹션 제목)
      // - text-h3: 1.75rem (28px) - lineHeight: 1.4, fontWeight: 600 (하위 섹션)
      // - text-h4: 1.5rem (24px) - lineHeight: 1.4, fontWeight: 600 (카드 제목)
      // - text-h5: 1.25rem (20px) - lineHeight: 1.5, fontWeight: 600 (소제목)
      // - text-h6: 1.125rem (18px) - lineHeight: 1.5, fontWeight: 600 (최소 헤딩)
      // 
      // Tailwind 기본 타이포그래피 클래스 (text-xs ~ text-6xl):
      // - text-xs: 0.75rem (12px) - 작은 텍스트, 캡션
      // - text-sm: 0.875rem (14px) - 보조 텍스트
      // - text-base: 1rem (16px) - 기본 본문 텍스트
      // - text-lg: 1.125rem (18px) - 강조 본문
      // - text-xl: 1.25rem (20px) - 큰 본문
      // - text-2xl: 1.5rem (24px) - 작은 헤딩
      // - text-3xl: 1.875rem (30px) - 중간 헤딩
      // - text-4xl: 2.25rem (36px) - 큰 헤딩
      // - text-5xl: 3rem (48px) - 매우 큰 헤딩
      // - text-6xl: 3.75rem (60px) - 극대형 헤딩
      // 
      // 사용 예시:
      // - 헤딩: <h1 class="text-h1">제목</h1>
      // - 본문: <p class="text-base">본문 텍스트</p>
      // - 캡션: <span class="text-sm text-gray-500">설명</span>
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
      // 간격 시스템 (spacing scale)
      // Tailwind CSS 기본값 사용 (4px 단위)
      // 디자인 원칙: 통일된 간격으로 일관성 있는 레이아웃 구성
      // 
      // 주요 spacing 값:
      // - 0: 0px
      // - 0.5: 2px (0.125rem)
      // - 1: 4px (0.25rem)
      // - 1.5: 6px (0.375rem)
      // - 2: 8px (0.5rem)
      // - 2.5: 10px (0.625rem)
      // - 3: 12px (0.75rem)
      // - 3.5: 14px (0.875rem)
      // - 4: 16px (1rem)
      // - 5: 20px (1.25rem)
      // - 6: 24px (1.5rem)
      // - 8: 32px (2rem)
      // - 10: 40px (2.5rem)
      // - 12: 48px (3rem)
      // - 16: 64px (4rem)
      // - 20: 80px (5rem)
      // - 24: 96px (6rem)
      // 
      // 사용 예시:
      // - padding: p-4 (16px), p-6 (24px)
      // - margin: m-2 (8px), m-4 (16px)
      // - gap: gap-4 (16px), gap-6 (24px)
      // 
      // 커스텀 spacing이 필요한 경우 여기에 추가 가능
      spacing: {
        // Tailwind 기본값 사용 (4px 단위)
        // 필요 시 커스텀 spacing 값 추가 가능
        // 예: '18': '4.5rem', '22': '5.5rem' 등
      },
      // 반응형 breakpoint 설정
      // 프로젝트 디자인 원칙에 따라 설정:
      // - Mobile: < 640px (sm 미만)
      // - Tablet: 640px ~ 1024px (sm ~ lg 미만)
      // - Desktop: >= 1024px (lg 이상)
      screens: {
        'sm': '640px',   // Small devices (landscape phones) - 모바일에서 태블릿으로 전환
        'md': '768px',   // Medium devices (tablets) - 태블릿 표준 크기
        'lg': '1024px',  // Large devices (desktops) - 태블릿에서 데스크톱으로 전환
        'xl': '1280px',  // Extra large devices (large desktops) - 큰 데스크톱
        '2xl': '1536px', // 2X Extra large devices (very large desktops) - 매우 큰 데스크톱
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

