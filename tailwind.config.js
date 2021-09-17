module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        mred: {
          DEFAULT: '#AC3931',
          light: '#D98680'
        },
        mblue: {
          DEFAULT: '#537D8D',
          light: '#C1D2D9'
        },
        mgreen: {
          DEFAULT: '#D9E76C',
          light: '#D3D9A7'
        },
        myellow: {
          DEFAULT: '#E5D352'
        },
        mpurple: {
          DEFAULT: '#482C3D'
        }
      },
      animation: {
        'spin-slow': 'spin-ccw 2s linear infinite'
      },
      keyframes: {
        'spin-ccw': {
          from: {
            transform: 'rotate(360deg)'
          },
          to: {
            transform: 'rotate(0deg)'
          }
        }
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ['even'],
      opacity: ['disabled'],
      cursor: ['disabled']
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}