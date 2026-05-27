/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ipb: {
          950: '#021A34', 900: '#042C53', 800: '#0C447C',
          700: '#185FA5', 600: '#2478C8', 500: '#378ADD',
          400: '#5BA3E8', 300: '#85B7EB', 200: '#B5D4F4',
          100: '#D6E9FA', 50:  '#EAF3FC', 25:  '#F4F9FE',
        },
        green: {
          900: '#173404', 700: '#3B6D11', 500: '#639922', 100: '#EAF3DE',
        },
        amber: {
          700: '#854F0B', 500: '#BA7517', 100: '#FAEEDA',
        },
        danger: {
          700: '#A32D2D', 500: '#E24B4A', 100: '#FCEBEB',
        },
        gray: {
          900: '#2C2C2A', 700: '#5F5E5A', 500: '#888780',
          300: '#B4B2A9', 200: '#C8C7BF', 100: '#D3D1C7',
          50:  '#F1EFE8', 25:  '#F8F7F4',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        sm:  '0 1px 4px rgba(4,44,83,.08)',
        md:  '0 4px 16px rgba(4,44,83,.12)',
        lg:  '0 8px 32px rgba(4,44,83,.16)',
        nav: '0 2px 8px rgba(0,0,0,.2)',
      },
      borderRadius: {
        sm: '6px', md: '8px', lg: '10px', xl: '12px', '2xl': '16px',
      },
    },
  },
  plugins: [],
}
