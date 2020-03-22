module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],

  pwa: {
    name: 'shop-list',
    themeColor: '#00BCD4',
    manifestOptions: {
      background_color: '#607D8B'
    }
  },

  publicPath: process.env.NODE_ENV === 'production'
    ? '/tobuy/'
    : '/'
}