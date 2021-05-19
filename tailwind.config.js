module.exports = {
  purge: ['./pages/**/*.tsx', './components/**/*.tsx'],
  darkMode: 'media',
  mode: 'jit',
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
