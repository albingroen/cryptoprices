module.exports = {
  purge: ['./pages/**/*.tsx', './components/**/*.tsx'],
  darkMode: 'media',
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      backgroundOpacity: ['dark'],
      opacity: ['dark']
    },
  },
  plugins: [],
}
