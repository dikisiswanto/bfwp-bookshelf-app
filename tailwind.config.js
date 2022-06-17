module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        'primary': '#0284c7',
      },
      width: {
        'sidebar': '38%',
        'content': '62%'
      }
    },
    fontFamily: {
      main: ['Poppins', 'sans-serif'],
    }
  },
}