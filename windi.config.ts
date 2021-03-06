import { defineConfig } from 'windicss/helpers'
// import colors from 'windicss/colors'
import typography from 'windicss/plugin/typography'

export default defineConfig({
  darkMode: 'class',
  // https://windicss.org/posts/v30.html#attributify-mode
  attributify: true,

  plugins: [
    typography(),
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00ADB5',
        secondary: '#393E46',
        accent: '#4a515c',
        context: '#EEEEEE',
        base: '#222831',

        // 'dark-base-1': '#212026',
        // 'dark-base-2': '#42404d',
        // 'dark-base-3': '#6b687d',
        // 'dark-content-1': '#d7d5e0',
        // 'dark-content-2': '#bab8c2',
        // 'dark-content-3': '#a5a3ad',
      },
      // typography: {
      //   DEFAULT: {
      //     css: {
      //       maxWidth: '65ch',
      //       color: 'inherit',
      //       a: {
      //         'color': 'inherit',
      //         'opacity': 0.75,
      //         'fontWeight': '500',
      //         'textDecoration': 'underline',
      //         '&:hover': {
      //           opacity: 1,
      //           color: colors.teal[600],
      //         },
      //       },
      //       b: { color: 'inherit' },
      //       strong: { color: 'inherit' },
      //       em: { color: 'inherit' },
      //       h1: { color: 'inherit' },
      //       h2: { color: 'inherit' },
      //       h3: { color: 'inherit' },
      //       h4: { color: 'inherit' },
      //       code: { color: 'inherit' },
      //     },
      //   },
      // },
    },
  },
})
